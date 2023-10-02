import {SwapBuilder} from "../swapper";
import {StarkNetAccount} from "../../account/Account";
import { BigNumberish, Call, Contract, uint256} from "starknet";
import { Swap, SwapRequest} from "../../halp";
import { tokenMap} from "../../tokens";
import {rateCalc, useSlippage} from "../slippage";
import {routerAbi} from './routerAbi'
import {Big} from 'big.js'
import axios from "axios";
import {ethers} from "ethers";



interface GetRouteReq {
    "amount": string,
    "tokenInAddress": string,
    "tokenOutAddress": string,
}

export class FibrousSwap implements SwapBuilder {

    debug = false
    protected router: string = '0x01b23ed400b210766111ba5b1e63e33922c6ba0c45e6ad56ce112e5f4c578e62'

    protected account: StarkNetAccount
    protected routerContract: Contract

    constructor(account: StarkNetAccount) {
        this.account = account
        this.routerContract = new Contract(routerAbi,this.router, this.account.acc)
    }

    private async getRoute(req: GetRouteReq): Promise<RouteRes> {
        const cli = axios.create({})
        const res = await cli.get(`https://api.fibrous.finance/route?amount=${req.amount}&tokenInAddress=${req.tokenInAddress}&tokenOutAddress=${req.tokenOutAddress}`)
        return res.data
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
    async buildCallData(req: SwapRequest): Promise<Swap> {

        const from = tokenMap.get(req.fromToken)
        if (!from) {
            throw new Error(`token: ${req.fromToken} is not supported`)
        }

        const to = tokenMap.get(req.toToken)
        if (!to) {
            throw new Error(`token: ${req.toToken} is not supported`)
        }


        const routes = await this.getRoute({
            amount: ethers.toBeHex(req.amount),
            tokenInAddress: from,
            tokenOutAddress: to,
        })

        if (!routes.success || routes.route.length === 0) {
            throw new Error('route not found')
        }

        if (routes.route[0].swaps.length === 0 || routes.route[0].swaps[0].length === 0){
            throw new Error('route not found')
        }

        const swap = routes.route[0].swaps[0][0]
        const output = routes.outputAmount

        const min = useSlippage(output, req.slippage)

        const cd: Call = {
            contractAddress: this.router,
            entrypoint: 'swap',
            calldata:{
                swaps: [
                    {
                        token_in: swap.fromTokenAddress,
                        token_out: swap.toTokenAddress,
                        rate: 1000000,
                        protocol: swap.protocol,
                        pool_address: swap.poolAddress
                    }],
                params:
                    {
                        token_in: swap.fromTokenAddress,
                        token_out: swap.toTokenAddress,
                        amount: uint256.bnToUint256(req.amount),
                        min_received: uint256.bnToUint256(min),
                        destination: this.account.pub
                    },
            }
        }

        const rate = rateCalc(req.fromToken, req.toToken, req.amount, min.toString())

        return {cd, rate: Number(rate)}
    }
}


export interface RouteRes {
    success: boolean
    inputToken: InputToken
    inputAmount: string
    outputToken: OutputToken
    outputAmount: string
    time: number
    estimatedGasUsed: string
    route: Route[]
    bestQuotesByProtocols: string[]
}

export interface InputToken {
    address: string
    decimals: number
    isBase: boolean
    isNative: boolean
    name: string
    symbol: string
    price: number
}

export interface OutputToken {
    address: string
    decimals: number
    isBase: boolean
    isNative: boolean
    name: string
    symbol: string
    price: number
    reserve: Reserve
}

export interface Reserve {
    type: string
    hex: string
}

export interface Route {
    percent: string
    swaps: SwapData[][]
}

export interface SwapData {
    protocol: number
    poolId: string
    poolAddress: string
    fromTokenAddress: string
    toTokenAddress: string
    percent: string
}
