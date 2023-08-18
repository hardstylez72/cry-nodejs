import {Account, BigNumberish, Call, num, uint256, Contract, CallData, Abi,} from "starknet";
import {StarkNetAccount} from "../../account/Account";
import {Address, tokenMap,} from "../../tokens";
import {abi} from "./abi";
import {useSlippage} from "../slippage";
import {defaultDeadline, SwapRequest} from "../../halp";
import {SwapBuilder} from "../swapper";



export class BuilderSith implements SwapBuilder{
    protected account: StarkNetAccount
    protected contract: Contract
    protected router: string = '0x028c858a586fa12123a1ccb337a0a3b369281f91ea00544d0c086524b759f627'

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

    private async getAmountOut(req: SwapRequest): Promise<{v: BigNumberish, stable: number}> {
        const path = this.makePath(req)
        const res = await this.contract.getAmountOut(uint256.bnToUint256(req.amount), path[0], path[1])
        const result: uint256.Uint256 = res.amount

        return {v:BigInt(result.low), stable: res.stable}
    }

     async buildCallData(req: SwapRequest): Promise<Call> {

         const path = this.makePath(req)

        const amountMin = await this.getAmountOut(req)
            .catch((err) => {throw new Error(`router.getAmountOut failed ${err.message}`)})

        const min = useSlippage(amountMin.v.toString(), req.slippage)

         const cd: Call = {
             contractAddress: this.router,
             entrypoint: 'swapExactTokensForTokensSupportingFeeOnTransferTokens',
             calldata: {
                 amountIn: uint256.bnToUint256(req.amount),
                 amountOutMin: uint256.bnToUint256(min),
                 routes: [{from_address: path[0], to_address:path[1], stable: 0}],
                 to: this.account.pub,
                 deadline: defaultDeadline()
             },
         }

         return cd
    }
}