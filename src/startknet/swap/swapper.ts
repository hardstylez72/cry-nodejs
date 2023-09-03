import {retryOpt, SwapRequest, SwapRes} from "../halp";
import {DefaultRes, StarkNetAccount} from "../account/Account";
import {Builder10kSwap} from "./10swap/builder";
import {BuilderSith} from "./sithswap/builder";
import {Abi, Call} from "starknet";
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
    buildCallData(req: SwapRequest)
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

    async swapEstimate(tx: Call): Promise<bigint> {

        const fee = await this.acc.acc.estimateFee(tx, {blockIdentifier: 'latest' })
            .catch((err) => {throw new Error(`swapEstimate failed ${err.message}`)})

        if (!fee || !fee.suggestedMaxFee) {
            throw new Error(`swapEstimate empty resp`)
        }

        return fee.suggestedMaxFee
    }

    async swap(req: SwapRequest, platform: Platform): Promise<SwapRes> {

        const builder = this.platforms.get(platform)
        if (!builder) {
            throw new Error(`platform ${platform} is not supported`)
        }

       const cd = await builder.buildCallData(req)

        let result: SwapRes = {}

        if (req.estimateOnly) {
            const fee = await retryAsyncDecorator(this.swapEstimate.bind(this), retryOpt)(cd)
            result.maxFee = fee.toString()
            return result
        }

        const res = await this.acc.acc.execute(cd, undefined, {maxFee: req.fee})
            .catch((err) => {throw new Error(`router.swap failed ${err.message}`)})

        result.swapTxId = res.transaction_hash

        return result
    }
}