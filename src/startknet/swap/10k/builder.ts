import {Account, BigNumberish, Call, num, uint256, Contract, CallData, Abi,} from "starknet";
import {Approver} from "../../erc20/approver";
import {StarkNetAccount} from "../../account/Account";
import {Address, tokenMap, TokenName} from "../../tokens";
import Big from "big.js";
import {abi} from "./abi";
import {rateCalc, useSlippage} from "../slippage";
import {defaultDeadline, retryOpt, Swap, SwapRequest, SwapRes} from "../../halp";
import {SwapBuilder} from "../swapper";
import {retryAsync} from "ts-retry";
import {retryDecorator, retryAsyncDecorator} from "ts-retry/lib/cjs/retry/utils";





export class Builder10kSwap implements SwapBuilder {
    protected account: StarkNetAccount
    protected contract: Contract
    protected router: string = '0x07a6f98c03379b9513ca84cca1373ff452a7462a3b61598f0af5bb27ad7f76d1'

    constructor(account: StarkNetAccount) {
        this.account = account
        this.contract = new Contract(abi,this.router, this.account.acc)
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
     async buildCallData(req: SwapRequest): Promise<Swap> {

        const path = this.makePath(req)

        const amountMin = await retryAsyncDecorator(this.getAmountOut.bind(this), retryOpt)(req)
            .catch((err) => {throw new Error(`router.getAmountOut failed ${err.message}`)})

        const min = useSlippage(amountMin.toString(), req.slippage)

        const cd: Call = {
            contractAddress: this.router,
            entrypoint: 'swapExactTokensForTokens',
            calldata:{
                    amountIn:   uint256.bnToUint256(req.amount),
                    amountOutMin: uint256.bnToUint256(min),
                    path: path,
                    to: this.account.pub,
                    deadline: defaultDeadline()
                }
        }

        const rate = rateCalc(req.fromToken, req.toToken, req.amount, amountMin.toString())


         const  from = tokenMap.get(req.fromToken)
         if (!from) {
             throw new Error(`token: ${req.fromToken} is unsupported`)
         }

         const approve = {
             contractAddress: from,
             entrypoint: 'approve',
             calldata: CallData.compile({
                 spender: this.router,
                 amount: uint256.bnToUint256(req.amount),
             })
         }


         return {cd: [approve, cd], rate: Number(rate)}
    }
}