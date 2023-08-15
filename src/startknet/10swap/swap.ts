import {Account, BigNumberish, Call, num, uint256, Contract, CallData,} from "starknet";
import {Approver} from "../erc20/approver";
import {StarkNetAccount} from "../account/Account";
import {Address, tokenMap, TokenName} from "../tokens";
import Big from "big.js";
import {abi} from "./abi";


export const defaultDeadline = () => {
    return Math.floor(Date.now() / 1000) + 120
}

type SwapRequest = {
    fromToken: TokenName
    toToken: TokenName

    amount: string

    estimateOnly: boolean

    fee?: string
}

type SwapRes = {
    approveTxId?: string
    swapTxId?: string

    maxFee?: string
}


export class Swapper10k {
    protected account: StarkNetAccount
    protected approver: Approver
    protected contract: Contract
    protected router: string = '0x07a6f98c03379b9513ca84cca1373ff452a7462a3b61598f0af5bb27ad7f76d1'

    constructor(account: StarkNetAccount) {
        this.account = account
        this.approver = new Approver(account)
        this.contract = new Contract(abi,this.router, this.account.acc)
    }


    async Swap(req: SwapRequest): Promise<SwapRes> {

        const result: SwapRes = {}
        const approve = await this.approver.Approve({spender: this.router, token: req.fromToken, amount: req.amount})
        if (approve.txId) {
            result.approveTxId = approve.txId
        }

        const swap = await this.swap(req)

        result.swapTxId = swap.swapTxId
        result.maxFee = swap.maxFee

        return result
    }

    private makePath(req: SwapRequest): Address[] {
       const  from = tokenMap.get(req.fromToken)
        if (!from) {
            throw new Error(`token: ${req.fromToken} is unsupported`)
        }

        const  to = tokenMap.get(req.toToken)
        if (!to) {
            throw new Error(`token: ${req.toToken} is unsupported`)
        }

        return [from, to]
    }

    private async getAmountOut(req: SwapRequest): Promise<BigNumberish> {
        const path = this.makePath(req)
        const res = await this.contract.getAmountsOut(uint256.bnToUint256(req.amount), path)
        const result: uint256.Uint256 = res.amounts[1]

        return BigInt(res.amounts[1].low)
    }
    private async swap(req: SwapRequest): Promise<SwapRes> {

        let result: SwapRes = {}

        const path = this.makePath(req)

        const amountMin = await this.getAmountOut(req)
            .catch((err) => {throw new Error(`router.getAmountOut failed ${err.message}`)})
        console.log('orig: ', amountMin.toString())

        let min = new Big(amountMin.toString()).div(1000).mul(995).round()
        console.log('min: ', min.toString())

        const cd: Call = {
            contractAddress: this.router,
            entrypoint: 'swapExactTokensForTokens',
            calldata:{
                    amountIn:   uint256.bnToUint256(req.amount),
                    amountOutMin: uint256.bnToUint256(min.toString()),
                    path: path,
                    to: this.account.pub,
                    deadline: defaultDeadline()
                }
        }



        if (req.estimateOnly) {
            const fee = await this.account.acc.estimateFee(cd, {blockIdentifier: 'latest' })
                .catch((err) => {throw new Error(`estimate swap fee failed ${err.message}`)})
            result.maxFee = fee.suggestedMaxFee.toString()

            return result
        }

        const res = await this.account.acc.execute(cd, undefined, {maxFee: req.fee})
            .catch((err) => {throw new Error(`router.swap failed ${err.message}`)})
        result.swapTxId = res.transaction_hash

        return result
    }
}