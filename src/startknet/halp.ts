import {BigNumberish, uint256} from "starknet";

export const uint256toString = (v: uint256.Uint256): string => {
    return v.low.toString()
}