import {Account, CallData, TransactionStatus, hash, num, uint256, Contract,} from "starknet";
import {tokenMap, TokenName} from "../tokens";
import {StarkNetAccount} from "../account/Account";
import Big from "big.js";
import {abi} from "./abi";
import {uint256toString} from "../halp";


type ApproveReq = {
    amount: string
    spender: string
    token: TokenName
}

type ApproveRes = {
    txId?: string
}

type AllowedReq = {
    token: TokenName
    addr: string
    spender: string
}


type AllowedRes = {
    amount: string
}
export class Approver {
    protected account: StarkNetAccount
    constructor(account: StarkNetAccount) {
        this.account = account
    }


    async Approve(req: ApproveReq): Promise<ApproveRes> {

        const allowed = await this.allowance({token: req.token, spender: req.spender, addr: this.account.pub})

        if (allowed.lt(new Big(req.amount))) {
            const res = await this.approve(req).catch((err => {throw new Error(`approve on ${req.token} failed: ${err.message}`)}))
        }
        return {}
    }


    async approve(req: ApproveReq): Promise<ApproveRes> {
        const tokenAddr = tokenMap.get(req.token)
        if (!tokenAddr) {
            throw new Error(`token: ${req.token} is unsupported`)
        }

        const calls = {
            contractAddress: tokenAddr,
            entrypoint: 'approve',
            calldata: CallData.compile({
                spender: req.spender,
                amount: uint256.bnToUint256(req.amount),
            })}
        const estimate = await this.account.acc.estimateFee(calls, {blockIdentifier: 'latest'})
        const res = await this.account.acc.execute(calls, [abi], { maxFee: estimate.suggestedMaxFee,})

        console.log('approve: ' + res.transaction_hash)
        await this.account.provider.waitForTransaction(res.transaction_hash, {retryInterval: 1000, successStates:[TransactionStatus.ACCEPTED_ON_L2, TransactionStatus.ACCEPTED_ON_L1]})

        return {txId: res.transaction_hash}
    }

    async allowance(req: AllowedReq): Promise<Big> {

        const tokenAddr = tokenMap.get(req.token)
        if (!tokenAddr) {
            throw new Error(`token: ${req.token} is unsupported`)
        }


        const contract = new Contract(abi, tokenAddr,  this.account.provider)

        const res = await contract.call('allowance', [req.addr, req.spender])

        // @ts-ignore
        const result: uint256.Uint256 = res.remaining



        return new Big(uint256toString(result))
    }
}