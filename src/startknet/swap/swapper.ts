import {SwapRequest, SwapRes} from "../halp";
import {DefaultRes, StarkNetAccount} from "../account/Account";
import {Builder10kSwap} from "./10swap/builder";
import {BuilderSith} from "./sithswap/builder";
import {Abi} from "starknet";
import {BuilderJediSwap} from "./jediswap/builder";


export enum Platform {
    Swap10k= 'Swap10k',
    SithSwap = 'SithSwap',

    JediSwap = 'JediSwap',
}

export interface SwapBuilder {
    buildCallData(req: SwapRequest)
    abi(): Abi
}

export class Swapper {

    platforms: Map<Platform, SwapBuilder>
    acc: StarkNetAccount
    constructor(acc: StarkNetAccount) {
        this.acc = acc

        this.platforms  = new Map<Platform, SwapBuilder>([
               [Platform.Swap10k, new Builder10kSwap(acc)],
               [Platform.SithSwap, new BuilderSith(acc)],
               [Platform.JediSwap, new BuilderJediSwap(acc)]
           ])
    }

    async swap(req: SwapRequest, platform: Platform): Promise<SwapRes> {

        const builder = this.platforms.get(platform)
        if (!builder) {
            throw new Error(`platform ${platform} is not supported`)
        }

       const cd = await builder.buildCallData(req)

        let result: SwapRes = {}

        if (req.estimateOnly) {
            const fee = await this.acc.acc.estimateFee(cd, {blockIdentifier: 'latest' })
                .catch((err) => {throw new Error(`estimate swap fee failed ${err.message}`)})

            result.maxFee = fee.suggestedMaxFee.toString()
            return result
        }

        const res = await this.acc.acc.execute(cd, undefined, {maxFee: req.fee})
            .catch((err) => {throw new Error(`router.swap failed ${err.message}`)})

        result.swapTxId = res.transaction_hash

        return result
    }
}