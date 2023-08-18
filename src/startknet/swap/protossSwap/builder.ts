import {Account, BigNumberish, Call, num, uint256, Contract, CallData, Abi,} from "starknet";
import {Approver} from "../../erc20/approver";
import {StarkNetAccount} from "../../account/Account";
import {Address, tokenMap, TokenName} from "../../tokens";
import Big from "big.js";
import {poolAbi, routerAbi} from "./abi";
import {slippage, useSlippage} from "../slippage";
import {defaultDeadline, SwapRequest, SwapRes} from "../../halp";
import {SwapBuilder} from "../swapper";





export class BuilderProtossSwap implements SwapBuilder {
    protected account: StarkNetAccount
    protected contract: Contract

   private debug = true

    protected pools: Map<string, string> = new Map<string, string>(
        [
            [ 'ETHUSDC', '0x05a08fb18007357366a35739bd627fe00b00ff0881d58b076f34a69572f5fa8b']
        ]
    )
    protected router: string = '0x07a0922657e550ba1ef76531454cb6d203d4d168153a0f05671492982c2f7741'

    constructor(account: StarkNetAccount) {
        this.account = account
        this.contract = new Contract(routerAbi, this.router, this.account.acc)
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

    private getPoolId(a: TokenName, b: TokenName): {id: string, reverse: boolean} {
        let reverse = false
        let poolId = this.pools.get(a + b)
        if (!poolId) {
            poolId = this.pools.get(b + a)
            if (!poolId) {
                throw new Error(`unsupported pool: [${a} ${b}]`)
            }
            reverse = true
        }
        return {id: poolId, reverse: reverse}
    }

    private async getAmountOut(req: SwapRequest): Promise<BigNumberish> {

        const pool = this.getPoolId(req.fromToken, req.toToken)
       const poolContract = new Contract(poolAbi, pool.id, this.account.provider)
        const reserve = await poolContract.call('getReserves')

        let reserveIn, reserveOut
        if (pool.reverse) {
            // @ts-ignore
            reserveIn =reserve.reserve1
            // @ts-ignore
            reserveOut = reserve.reserve0
        } else {
            // @ts-ignore
            reserveIn = reserve.reserve0
            // @ts-ignore
            reserveOut = reserve.reserve1
        }

        const res = await this.contract.call('getAmountOut',[uint256.bnToUint256(req.amount), reserveIn ,reserveOut ])
        //@ts-ignore
        const result = BigInt(res.amountOut.low) * BigInt(2)

        if (this.debug) {
            console.log(`am in ${req.amount} of ${req.fromToken}`)
            console.log(`am out ${result} of ${req.toToken}`)
        }

        //@ts-ignore
        return BigInt(result)
    }
     async buildCallData(req: SwapRequest): Promise<Call> {

        const path = this.makePath(req)

        const amountMin = await this.getAmountOut(req)
            .catch((err) => {throw new Error(`router.getAmountOut failed ${err.message}`)})

        const min = useSlippage(amountMin.toString(), '50')

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
        return cd
    }
}