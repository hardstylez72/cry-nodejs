import Big from "big.js";

export type slippage = '0' | '0.1' | '0.5' | '1' | '2' | '50'

export const useSlippage = (v: string, slippage: slippage): string  => {
    switch (slippage) {
        case '0': return v
        case '0.1': return new Big(v).div(1000).mul(999).round().toString()
        case '0.5': return new Big(v).div(1000).mul(995).round().toString()
        case '1': return new Big(v).div(1000).mul(990).round().toString()
        case '2': return new Big(v).div(1000).mul(980).round().toString()
        case '50': return new Big(v).div(100).mul(50).round().toString()
        default: return v
    }
}