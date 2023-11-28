import {BigNumberish, Call, uint256} from "starknet";
import {TokenName} from "./tokens";
import {RetryOptions} from "ts-retry";

export const retryOpt = {maxTry: 1, delay: 100} as RetryOptions
export const uint256toString = (v: uint256.Uint256): string => {
    return v.low.toString()
}


export type SwapRequest = {
    fromToken: TokenName
    toToken: TokenName

    amount: string

    estimateOnly: boolean

    fee?: string
    slippage: string
}

export type Swap = {
    cd: Call | Call[]
    rate: number
}

export type SwapRes = {
    swapTxId?: string
    maxFee?: string
    rate: number
}

export const defaultDeadline = () => {
    return Math.floor(Date.now() / 1000) + 120
}