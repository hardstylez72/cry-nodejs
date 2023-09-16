import {retryOpt, Swap, SwapRequest, SwapRes} from "../halp";
import {DefaultRes, StarkNetAccount} from "../account/Account";
import {Builder10kSwap} from "./10swap/builder";
import {BuilderSith} from "./sithswap/builder";
import {Abi, Call, CallData} from "starknet";
import {BuilderJediSwap} from "./jediswap/builder";
import {BuilderMySwap} from "./mySwap/builder";
import {BuilderProtossSwap} from "./protossSwap/builder";
import {retryAsyncDecorator} from "ts-retry/lib/cjs/retry/utils";


export enum Platform {
    Swap10k= 'Swap10k',
    SithSwap = 'SithSwap',
    JediSwap = 'JediSwap',
    MySwap = 'MySwap',
    ProtossSwap = 'ProtossSwap'
}

export interface SwapBuilder {
    buildCallData(req: SwapRequest): Promise<Swap>
}

export class Swapper {
    platforms: Map<Platform, SwapBuilder>
    acc: StarkNetAccount
    constructor(acc: StarkNetAccount) {
        this.acc = acc
        this.platforms  = new Map<Platform, SwapBuilder>([
               [Platform.Swap10k, new Builder10kSwap(acc)],
               [Platform.SithSwap, new BuilderSith(acc)],
               [Platform.JediSwap, new BuilderJediSwap(acc)],
               [Platform.MySwap, new BuilderMySwap(acc)],
               [Platform.ProtossSwap, new BuilderProtossSwap(acc)]
           ])
    }

    async swapEstimate(tx: Call): Promise<string> {

        const fee = await this.acc.acc.estimateFee(tx, {blockIdentifier: 'latest' })
            .catch((err) => {throw new Error(`swapEstimate failed ${err.message}`)})

        if (!fee || !fee.suggestedMaxFee) {
            throw new Error(`swapEstimate empty resp`)
        }

        return fee.suggestedMaxFee.toString()
    }

    async swap(req: SwapRequest, platform: Platform): Promise<SwapRes> {

        const builder = this.platforms.get(platform)
        if (!builder) {
            throw new Error(`platform ${platform} is not supported`)
        }

       const data = await builder.buildCallData(req)
        let result: SwapRes = {rate: data.rate}

        if (req.estimateOnly || !req.fee) {
            const fee = await retryAsyncDecorator(this.swapEstimate.bind(this), retryOpt)(data.cd)
            req.fee = fee.toString()
            result.maxFee = req.fee

            if (req.estimateOnly) {
                return result
            }
        }

        result.swapTxId = await retryAsyncDecorator(this._swap.bind(this), retryOpt)(data.cd, req.fee)
        result.maxFee = req.fee


        return result
    }


    private async _swap(cd: Call, fee: string): Promise<string> {
        const res = await this.acc.acc.execute(cd, undefined, {maxFee: fee})
            .catch((err) => {throw new Error(`router.swap failed ${err.message}`)})

        if  (!res.transaction_hash) {
            throw new Error('empty response')
        }
        return res.transaction_hash
    }
}