import {DefaultRes, StarkNetAccount} from "../account/Account";
import {tokenMap, TokenName} from "../tokens";
import {Call, uint256} from "starknet";
import {retryAsyncDecorator} from "ts-retry/lib/cjs/retry/utils";
import {retryOpt} from "../halp";


export type TransferReq = {
    toAddr: string
    token:  TokenName
    amount: string
    maxFee?: string
    estimateOnly: boolean
}

export class Transfer {

    acc: StarkNetAccount
    constructor(acc: StarkNetAccount) {
        this.acc = acc
    }
    async transfer(req: TransferReq): Promise<DefaultRes> {

        const cd = this.buildTx(req)
        let result: DefaultRes = {EstimatedMaxFee: '0'}

        if (req.estimateOnly || !req.maxFee) {
            req.maxFee = await retryAsyncDecorator(this.transferEstimate.bind(this), retryOpt)(req)
            result.EstimatedMaxFee = req.maxFee
            result.ContractAddr = cd.contractAddress
            if (req.estimateOnly) {
                return result
            }
        }

        result.TxHash = await retryAsyncDecorator(this.execute.bind(this), retryOpt)(cd, req.maxFee)

        return result
    }

    async transferEstimate(req: TransferReq): Promise<string> {
        const cd = this.buildTx(req)
        const fee = await this.acc.Estimate(cd, '')
        if (!fee) {
            throw new Error(`result is empty`)
        }
        return fee.toString()
    }

    private async execute(cd: Call, fee: string): Promise<string> {
        const tx = await this.acc.Execute(cd, fee, "")
        if (!tx) {
            throw new Error(`transfer empty response`)
        }
        return tx
    }

    private buildTx(req: TransferReq): Call {

        const addr = tokenMap.get(req.token)
        if (!addr) {
            throw new Error(`token: ${req.token} is not supported`)
        }

        if (!req.toAddr) {
            throw new Error(`to addr is empty`)
        }

       return {
            contractAddress: addr,
            entrypoint: "transfer",
            calldata: {
                recipient: req.toAddr,
                amount: uint256.bnToUint256(req.amount),
            }
        }
    }
}