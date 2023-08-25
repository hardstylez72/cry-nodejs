import {EthProvider} from "./provider";
import {
    ethers,
    JsonRpcProvider,
    SigningKey,
    TransactionRequest,
    Wallet,
    GasCostParameters,
    PreparedTransactionRequest
} from "ethers";
import {TokenName} from "../tokens";
import Big, {Big_} from "big.js";

export class EthAccount {
    provider: JsonRpcProvider
    w: Wallet
    constructor(provider: EthProvider, pk: string) {
        this.provider = provider.provider
        this.w = new ethers.Wallet(pk, this.provider)
    }


    async getNativeBalance(): Promise<Big> {
        const pub = await this.w.getAddress()
        const b = await  this.provider.getBalance(pub)
        return new Big(b.toString())
    }

}

export type TxReq = {
    to: string,
    data: string
    value: string
}