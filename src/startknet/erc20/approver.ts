import {Call, CallData, Contract, hash, Provider, RpcProvider, uint256,} from "starknet";
import {tokenMap, TokenName} from "../tokens";
import {StarkNetAccount} from "../account/Account";
import Big from "big.js";
import {ERC20_ABI as abi} from "./abi";
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

    static async Balance(token: TokenName, provider: RpcProvider, pub: string): Promise<string> {

        const tokenAddr = tokenMap.get(token)
        if (!tokenAddr) {
            throw new Error(`token: ${token} is unsupported`)
        }

        const contract = new Contract(abi, tokenAddr,  provider)

        const res = await contract.call('balanceOf', CallData.compile([pub]))

        // @ts-ignore
        const result: uint256.Uint256 = res.balance

        return uint256toString(result)
    }

    async Approve(req: ApproveReq): Promise<ApproveRes> {

        const allowed = await retryAsyncDecorator(this.allowance.bind(this), retryOpt)({token: req.token, spender: req.spender, addr: this.account.pub})

        if (allowed.lt(new Big(req.amount))) {
            return await retryAsyncDecorator(this.approve.bind(this), {maxTry:5})(req).catch((err => {
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

        const maxFee = await  this.account.Estimate(calls, "approve")

        const res = await this.account.acc.execute(calls, [abi], { maxFee: maxFee})

        if (!res.transaction_hash) {
            throw new Error('starknet in alpha stage')
        }

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

    async balanceOf(tokenAddr: string): Promise<Big> {

        const contract = new Contract(abi, tokenAddr,  this.account.provider)

        const res = await contract.call('balanceOf', [this.account.pub])

        // @ts-ignore
        const result: uint256.Uint256 = res.balance

        return new Big(uint256toString(result))
    }
}