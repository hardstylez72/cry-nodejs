import {DefaultRes, StarkNetAccount} from "../account/Account";
import {Call, CallData} from "starknet";
import Jabber  from "jabber";
import {retryAsyncDecorator} from "ts-retry/lib/cjs/retry/utils";
import {retryOpt} from "../halp";


export type SendDmail = {
    estimateOnly: boolean
}
export class Dmail {
    private contractAddr = "0x0454f0bd015e730e5adbb4f080b075fdbf55654ff41ee336203aa2e1ac4d4309"
    protected acc: StarkNetAccount
    protected rand: Jabber
    constructor(acc: StarkNetAccount) {
        this.acc = acc
        this.rand = new Jabber()
    }

    async sendDmailEstimate(tx: Call): Promise<bigint> {

        const fee = await this.acc.acc.estimateFee(tx, {blockIdentifier: 'latest' })
            .catch((err) => {throw new Error(`sendDmailEstimate fee failed ${err.message}`)})

        if (!fee || !fee.suggestedMaxFee) {
            throw new Error(`sendDmailEstimate empty resp`)
        }

        return fee.suggestedMaxFee
    }
    async sendDmail(req:  SendDmail): Promise<DefaultRes> {
        const tx = this.buildTx()

        let result: DefaultRes = {
            EstimatedMaxFee: '0'
        }

        const fee = await retryAsyncDecorator(this.sendDmailEstimate.bind(this), retryOpt)(tx)

        result.EstimatedMaxFee = fee.toString()
        if (req.estimateOnly) {
            return result
        }

        const res = await this.acc.acc.execute(tx, undefined, {maxFee: result.EstimatedMaxFee})
            .catch((err) => {throw new Error(`sendDmail failed ${err.message}`)})

        result.TxHash = res.transaction_hash
        result.ContractAddr = this.contractAddr

        return result
    }
    private buildTx(): Call {
        const to = this.rand.createEmail('gmail.com')
        const theme = this.rand.createParagraph(2)

        return {
            contractAddress: this.contractAddr,
            entrypoint: "transaction",
            calldata: CallData.compile({
                to,
                theme,
            })
        }
    }
}