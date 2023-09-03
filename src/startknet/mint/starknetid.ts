import {DefaultRes, StarkNetAccount} from "../account/Account";
import {Account, Call, CallData} from "starknet";
import prand from 'pure-rand';
import {retryAsyncDecorator} from "ts-retry/lib/cjs/retry/utils";
import {retryOpt} from "../halp";


export type SimpleMint = {
    estimateOnly: boolean
}
export class StarkNetId {
    contractAddr = '0x05dbdedc203e92749e2e746e2d40a768d966bd243df04a6b712e222bc040a9af'
    private acc: Account
    constructor(acc: StarkNetAccount) {
        this.acc = acc.acc
    }

    async mintEstimate(tx: Call): Promise<bigint> {
        const fee = await this.acc.estimateFee(tx, {blockIdentifier: 'latest' })
            .catch((err) => {throw new Error(`mintEstimate fee failed ${err.message}`)})

        if (!fee || !fee.suggestedMaxFee) {
            throw new Error(`mintEstimate empty resp`)
        }

        return fee.suggestedMaxFee
    }

    async mint(req: SimpleMint): Promise<DefaultRes> {

        const cd = this.buildTx()


        let result: DefaultRes = {
            EstimatedMaxFee: '0'
        }

        const fee = await retryAsyncDecorator(this.mintEstimate.bind(this), retryOpt)(cd)

        result.EstimatedMaxFee = fee.toString()
        if (req.estimateOnly) {
            return result
        }

        const res = await this.acc.execute(cd, undefined, {maxFee: result.EstimatedMaxFee})
            .catch((err) => {throw new Error(`mint failed ${err.message}`)})

        result.TxHash = res.transaction_hash
        result.ContractAddr = this.contractAddr

        return result
    }

    private buildTx(): Call {

        const seed = Date.now() ^ (Math.random() * 0x100000000);
        const rngSimulation1 = prand.xoroshiro128plus(seed);
        //@ts-ignore
        const rng = rngSimulation1.jump()
        const diceSim2Value = prand.unsafeUniformIntDistribution(115710818677, 815710818677, rng)

        return {
            contractAddress: this.contractAddr,
            entrypoint: "mint",
            calldata: {
                starknet_id: diceSim2Value.toString()
            }
        }
    }
}