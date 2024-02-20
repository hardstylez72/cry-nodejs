import {DefaultRes, StarkNetAccount} from "../account/Account";
import {tokenMap, TokenName} from "../tokens";
import {Call, CallData, Contract, uint256} from "starknet";
import axios from "axios";
import {SupplyPoolReq, WithdrawPoolReq} from "./zklend";
import {ERC20_ABI} from "../erc20/abi";
import {Approver} from "../erc20/approver";





// https://starkscan.co/tx/0x52be7cc25c4029bc76c77a920fd9ffe1192f11d3f1539504b05d61eb31b3287
export class NostraPool {
    private addr: Map<TokenName, string> = new Map(
        [
            ['ETH', '0x07170f54dd61ae85377f75131359e3f4a12677589bb7ec5d61f362915a5c0982'],
            ['USDT', '0x06669cb476aa7e6a29c18b59b54f30b8bfcfbb8444f09e7bbb06c10895bf5d7b'],
            ['USDC', '0x06eda767a143da12f70947192cd13ee0ccc077829002412570a88cd6539c1d85'],
            ['DAI', '0x02b5fd690bb9b126e3517f7abfb9db038e6a69a068303d06cf500c49c1388e20'],
        ]
    )

    private acc: StarkNetAccount
    constructor(acc: StarkNetAccount) {
        this.acc = acc
    }

    private async userBalance(token: TokenName): Promise<string> {

        const t = this.addr.get(token)
        if (!t) {
            throw new Error(`token: ${t} not supported`)
        }
        const erc20 = new Approver(this.acc)
        const b = await erc20.balanceOf(t)

        return b.toString()
    }

    public async withdraw(req: WithdrawPoolReq): Promise<DefaultRes> {
        const op = "nostra.withdraw"

        const cd = await this.buildWithdraw(req)

        let result: DefaultRes = {EstimatedMaxFee: ''}

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

    // https://starkscan.co/tx/0x51251a84b12f2762d7ee3708b5421a950c07bd49309c28ecde4a3acddd186fd
    private async buildWithdraw(req: WithdrawPoolReq): Promise<Call[]> {

        const nostraTokenAddr = this.addr.get(req.token)
        if (!nostraTokenAddr) {
            throw new Error(`token: ${nostraTokenAddr} not supported`)
        }

        const am = await this.userBalance(req.token)

        const burn: Call = {
            contractAddress: nostraTokenAddr,
            entrypoint: 'burn',
            calldata:{
                burnFrom:   this.acc.pub,
                to: this.acc.pub,
                amount: uint256.bnToUint256(am),
            }
        }

        return [burn]
    }

    // https://starkscan.co/tx/0x64c96e7899d9c1746769094a0e1e790b651a5ebe4abba778b990e0c95121c7c
    public async deposit(req: SupplyPoolReq): Promise<DefaultRes> {
        const op = "nostra.deposit"

        const cd = await this.buildDeposit(req)

        let result: DefaultRes = {EstimatedMaxFee: ''}

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

    private async buildDeposit(req: SupplyPoolReq): Promise<Call | Call[]> {

        const nostraTokenAddr = this.addr.get(req.token)
        if (!nostraTokenAddr) {
            throw new Error(`token: ${nostraTokenAddr} not supported`)
        }

        const token = tokenMap.get(req.token)
        if (!token) {
            throw new Error(`token: ${token} not supported`)
        }

        const mint: Call = {
            contractAddress: nostraTokenAddr,
            entrypoint: 'mint',
            calldata:{
                to:   this.acc.pub,
                amount: uint256.bnToUint256(req.amount),
            }
        }

        const approve = {
            contractAddress: token,
            entrypoint: 'approve',
            calldata: CallData.compile({
                spender: nostraTokenAddr,
                amount: uint256.bnToUint256(req.amount),
            })
        }

        return [approve, mint]
    }



}


