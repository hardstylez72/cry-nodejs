import {SwapBuilder} from "../swapper";
import {StarkNetAccount} from "../../account/Account";
import {BigNumberish, Call, CallData, Contract, uint256} from "starknet";
import { Swap, SwapRequest} from "../../halp";
import { tokenMap} from "../../tokens";
import {rateCalc, useSlippage} from "../slippage";
import axios from "axios";
import {Router, Router as FibrousRouter} from "./router-sdk/index";
import { BigNumber } from "@ethersproject/bignumber";
import {toBigInt} from "ethers";



interface GetRouteReq {
    "amount": string,
    "tokenInAddress": string,
    "tokenOutAddress": string,
}

export class FibrousSwap implements SwapBuilder {

    debug = false
    protected router: Router

    protected account: StarkNetAccount
    protected routerContract: Contract

    constructor(account: StarkNetAccount) {
        this.router = new FibrousRouter();
        this.account = account
    }

    private async getRoute(req: GetRouteReq): Promise<RouteRes> {
        const cli = axios.create({})
        const res = await cli.get(`https://api.fibrous.finance/route?amount=${req.amount}&tokenInAddress=${req.tokenInAddress}&tokenOutAddress=${req.tokenOutAddress}`)
        return res.data
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


        const receiverAddress = this.account.pub;

        const slip = Number(req.slippage) / 1000
        const approveCall:Call = await this.router.buildApprove(
            BigNumber.from(req.amount),
            from,
        );

        const swapCall = await this.router.buildTransaction(
            BigNumber.from(req.amount),
            from,
            to,
            slip,
            receiverAddress,
        );

        const min = toBigInt(swapCall.calldata[4])

        const rate = rateCalc(req.fromToken, req.toToken, req.amount, min.toString())


        return {cd: [approveCall, swapCall], rate: Number(rate)}
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
