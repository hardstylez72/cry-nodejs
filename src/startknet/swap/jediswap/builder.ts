import {Builder10kSwap} from "../10swap/builder";
import {SwapBuilder} from "../swapper";
import {StarkNetAccount} from "../../account/Account";
import {Abi, BigNumberish, Call, Contract, uint256} from "starknet";
import {defaultDeadline, retryOpt, SwapRequest} from "../../halp";
import {Address, tokenMap} from "../../tokens";
import {useSlippage} from "../slippage";
import {poolAbi, routerAbi} from './routerAbi'
import {retryAsyncDecorator} from "ts-retry/lib/cjs/retry/utils";

export class BuilderJediSwap implements SwapBuilder {
    protected router: string = '0x041fd22b238fa21cfcf5dd45a8548974d8263b3a531a60388411c5e230f97023'

    protected pools: Map<string, string> = new Map<string, string>(
        [
            [ 'ETHUSDC', '0x04d0390b777b424e43839cd1e744799f3de6c176c7e32c1812a41dbd9c19db6a']
        ]
    )
    protected account: StarkNetAccount
    protected routerContract: Contract

    constructor(account: StarkNetAccount) {
        this.account = account
        this.routerContract = new Contract(routerAbi,this.router, this.account.acc)
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

        let reverse = false

        let pool = this.pools.get(req.fromToken+req.toToken)
        if (!pool) {
            pool = this.pools.get(req.toToken +req.fromToken)
            if (!pool) {
                throw new Error(`unsupported pair [ ${req.fromToken}; ${req.toToken}]`)
            }
            reverse = true
        }

        const poolContract = new Contract(poolAbi,pool, this.account.acc)

        const reserves = await poolContract.call('get_reserves')

        let reserveIn, reserveOut
        if (reverse) {
            // @ts-ignore
            reserveIn = reserves.reserve1
            // @ts-ignore
            reserveOut = reserves.reserve0
        } else {
            // @ts-ignore
            reserveIn = reserves.reserve0
            // @ts-ignore
            reserveOut = reserves.reserve1
        }

        const res = await this.routerContract.call('get_amount_out', [uint256.bnToUint256(req.amount), reserveIn, reserveOut])
        // @ts-ignore
        const result: uint256.Uint256 = res.amountOut
        // @ts-ignore
        return BigInt(result.low)
    }
    async buildCallData(req: SwapRequest): Promise<Call> {

        const path = this.makePath(req)

        const amountMin = await retryAsyncDecorator(this.getAmountOut.bind(this), retryOpt)(req)
            .catch((err) => {throw new Error(`router.getAmountOut failed ${err.message}`)})

        const min = useSlippage(amountMin.toString(), req.slippage)

        const cd: Call = {
            contractAddress: this.router,
            entrypoint: 'swap_exact_tokens_for_tokens',
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