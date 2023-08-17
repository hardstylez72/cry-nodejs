import {BigNumberish, uint256} from "starknet";
import {TokenName} from "./tokens";
import {slippage} from "./swap/slippage";

export const uint256toString = (v: uint256.Uint256): string => {
    return v.low.toString()
}


export type SwapRequest = {
    fromToken: TokenName
    toToken: TokenName

    amount: string

    estimateOnly: boolean

    fee?: string
    slippage: slippage
}

export type SwapRes = {
    swapTxId?: string

    maxFee?: string
}

export const defaultDeadline = () => {
    return Math.floor(Date.now() / 1000) + 120
}