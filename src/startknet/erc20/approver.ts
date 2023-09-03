import {Call, CallData, Contract, uint256,} from "starknet";
import {tokenMap, TokenName} from "../tokens";
import {StarkNetAccount} from "../account/Account";
import Big from "big.js";
import {abi} from "./abi";
import {retryOpt, uint256toString} from "../halp";
import {retryAsyncDecorator, retryDecorator} from "ts-retry/lib/cjs/retry/utils";


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

        const allowed = await retryAsyncDecorator(this.allowance.bind(this), retryOpt)({token: req.token, spender: req.spender, addr: this.account.pub})

        if (allowed.lt(new Big(req.amount))) {
            return await retryAsyncDecorator(this.approve.bind(this), {maxTry:2})(req).catch((err => {
                throw new Error(`approve on ${req.token} failed: ${err.message}`)
            }))
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

        const maxFee = await retryAsyncDecorator(this.approveEstimate.bind(this), retryOpt)(calls)

        const res = await this.account.acc.execute(calls, [abi], { maxFee: maxFee,})

        return {txId: res.transaction_hash}
    }


    private async approveEstimate(cd: Call): Promise<bigint> {
        const estimate = await this.account.acc.estimateFee(cd, {blockIdentifier: 'latest'})
        return estimate.suggestedMaxFee
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