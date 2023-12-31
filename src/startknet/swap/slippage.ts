import Big from "big.js";
import {TokenName} from "../tokens";


export const useSlippage = (v: string, slippage: string): string  => {

    const f = Number.parseFloat(slippage)

    if (f > 100 || f < 0.001) {
        throw new Error(`invalid slippage value: ${slippage} range [0.001:100]`)
    }

    const v10 = new Big(v).mul(10_000)
    const f10 = new Big(f).mul(10_000)

    const slippageValue = v10.mul(f10).div(10e9)

    return Big(v).sub(slippageValue).round().toString()
}

export const rateCalc = (from: TokenName, to: TokenName, amIn: string, amOut:string): number => {


    let fromDec = 1e18
    let toDec = 1e18

    switch (from) {
        case 'USDC':
            fromDec = 1e6;
            break
        case 'USDT':
            fromDec = 1e6;
            break
    }

    switch (to) {
        case 'USDC':
            toDec = 1e6;
            break
        case 'USDT':
            toDec = 1e6;
            break
    }


    const amInAbs = (new Big(amIn)).div(fromDec)
    const amOutAbs = (new Big(amOut)).div(toDec)

    const rate = amOutAbs.div(amInAbs).toString()

    let num = Number(rate)

    if (num < 1) {
        num = 1/num
    }

    return Math.abs(num)
}