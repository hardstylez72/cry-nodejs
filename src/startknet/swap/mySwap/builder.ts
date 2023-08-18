import {Builder10kSwap} from "../10swap/builder";
import {SwapBuilder} from "../swapper";
import {StarkNetAccount} from "../../account/Account";
import {Abi, BigNumberish, Call, Contract, num, uint256} from "starknet";
import {defaultDeadline, SwapRequest} from "../../halp";
import {Address, tokenMap, TokenName} from "../../tokens";
import {useSlippage} from "../slippage";
import {routerAbi} from './routerAbi'
import {Big} from 'big.js'

export class BuilderMySwap implements SwapBuilder {

    debug = false
    protected router: string = '0x010884171baf1914edc28d7afb619b40a4051cfae78a094a55d230f19e944a28'

    protected pools: Map<string, number> = new Map<string, number>(
        [
            [ 'ETHUSDC', 1]
            // https://starkscan.co/contract/0x010884171baf1914edc28d7afb619b40a4051cfae78a094a55d230f19e944a28#read-write-contract-sub-read
            // всего 8 пулов, можно потыкать
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

    private getPoolId(a: TokenName, b: TokenName): {id: number, reverse: boolean} {
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

    private async getAmountOut(req: SwapRequest, poolId: number, reverse: boolean): Promise<BigNumberish> {

        const poolContract = new Contract(routerAbi,this.router, this.account.acc)

        const res = await poolContract.call('get_pool', [poolId])

        let reserveIn:Big, reserveOut: Big
        if (reverse) {
            // @ts-ignore
            reserveIn = new Big(res.pool.token_b_reserves.low)
            // @ts-ignore
            reserveOut = new Big(res.pool.token_a_reserves.low)
        } else {
            // @ts-ignore
            reserveIn =  new Big(res.pool.token_a_reserves.low)
            // @ts-ignore
            reserveOut = new Big(res.pool.token_b_reserves.low)
        }

        const ratio = reserveOut.div(reserveIn)

        const amOut = (ratio.mul(new Big(req.amount))).round()

        if (this.debug) {
            console.log('reserveIn ' + reserveIn.toString())
            console.log('reserveOut ' + reserveOut.toString())
            console.log('ratio ' + ratio.toString())
            console.log('Token in am: ' + new Big(req.amount).toString())
            console.log('Token out am: ' +amOut.toString())
        }

        // @ts-ignore
        return BigInt(amOut.toString())
    }
    async buildCallData(req: SwapRequest): Promise<Call> {

        const path = this.makePath(req)
        const pool = this.getPoolId(req.fromToken, req.toToken)

        const amountMin = await this.getAmountOut(req, pool.id, pool.reverse)
            .catch((err) => {throw new Error(`router.getAmountOut failed ${err.message}`)})

        const min = useSlippage(amountMin.toString(), req.slippage)

        const cd: Call = {
            contractAddress: this.router,
            entrypoint: 'swap',
            calldata:{
                pool_id: pool.id,
                token_from_addr: path[0],
                amount_from: uint256.bnToUint256(req.amount),
                amount_to_min:  uint256.bnToUint256(min),
            }
        }
        return cd
    }
}