import {DefaultRes, StarkNetAccount} from "../account/Account";
import {tokenMap, TokenName} from "../tokens";
import {Call, Contract, uint256} from "starknet";
import {abi} from "./zklend_abi";
import {defaultDeadline, retryOpt, SwapRes} from "../halp";
import {retryAsyncDecorator} from "ts-retry/lib/cjs/retry/utils";
import axios from "axios";
import {RouteRes} from "../swap/fibrous/builder";



export interface SupplyPoolReq {
    token: TokenName
    amount: string
    estimateOnly: boolean
    fee?: string
}

export interface WithdrawPoolReq {
    token: TokenName
    estimateOnly: boolean
    fee?: string
}

export interface UserPool {
    pools: Pool[];
}

export interface Pool {
    data:         Data;
    token_symbol: string;
}

export interface Data {
    debt_amount:    string;
    is_collateral:  boolean;
    supply_amount:  string;
    wallet_balance: string;
}


// wd https://starkscan.co/tx/0x755263a4bf4846a50b5c56d7dfce45f2068479633cba4ab2d5d172187559e5c
export class ZkLendPool {

    private depositContractAddr = '0x04c0a5193d58f74fbace4b74dcf65481e734ed1714121bdc571da345540efa05'
    private withdrawContractAddr = '0x04c0a5193d58f74fbace4b74dcf65481e734ed1714121bdc571da345540efa05'
    private acc: StarkNetAccount
    constructor(acc: StarkNetAccount) {
        this.acc = acc
    }

    private async userPools(): Promise<UserPool> {
        const cli = axios.create({})
        const res = await cli.get(`https://data.app.zklend.com/users/${this.acc.pub}/all`)
        return res.data
    }

    private async userBalance(token: TokenName): Promise<string> {
        let am = "0x0"

        const res = await this.userPools()
        res.pools.some((p) => {
            if (p.token_symbol === token) {
               am =  p.data.supply_amount
                return true
            }
            return false
        })

        return am
    }

    // https://starkscan.co/tx/0x755263a4bf4846a50b5c56d7dfce45f2068479633cba4ab2d5d172187559e5c
    public async withdraw(req: WithdrawPoolReq): Promise<DefaultRes> {
        const op = "zklend.withdraw"

        const cd = await this.buildWithdraw(req)

        let result: DefaultRes = {EstimatedMaxFee: '0', ContractAddr: this.withdrawContractAddr}

        if (req.estimateOnly || !req.fee) {
            const fee = await this.acc.Estimate(cd, op)
            req.fee = fee.toString()
            result.EstimatedMaxFee = req.fee
        }

        if (req.estimateOnly) {
            return result
        }

        result.TxHash = await this.acc.Execute(cd, req.fee, op)

        return result
    }

    private async buildWithdraw(req: WithdrawPoolReq): Promise<Call> {

        const tokenAddr = tokenMap.get(req.token)
        if (!tokenAddr) {
            throw new Error(`token: ${req.token} is unsupported`)
        }

        const am = await this.userBalance(req.token)

        const cd: Call = {
            contractAddress: this.withdrawContractAddr,
            entrypoint: 'withdraw',
            calldata:{
                token:  tokenAddr,
                amount: am,
            }
        }
        return cd
    }

    // https://starkscan.co/tx/0x64c96e7899d9c1746769094a0e1e790b651a5ebe4abba778b990e0c95121c7c
    public async deposit(req: SupplyPoolReq): Promise<DefaultRes> {
        const op = "zklend.deposit"

        const cd = await this.buildDeposit(req)

        let result: DefaultRes = {EstimatedMaxFee: '0', ContractAddr: this.depositContractAddr}

        if (req.estimateOnly || !req.fee) {
            const fee = await this.acc.Estimate(cd, op)
            req.fee = fee.toString()
            result.EstimatedMaxFee = req.fee
        }

        if (req.estimateOnly) {
            return result
        }

        result.TxHash = await this.acc.Execute(cd, req.fee, op)

        return result
    }

    private async buildDeposit(req: SupplyPoolReq): Promise<Call> {

        const tokenAddr = tokenMap.get(req.token)
        if (!tokenAddr) {
            throw new Error(`token: ${req.token} is unsupported`)
        }

        const cd: Call = {
            contractAddress: this.depositContractAddr,
            entrypoint: 'deposit',
            calldata:{
                token:   tokenAddr,
                amount: req.amount,
            }
        }
        return cd
    }



}


