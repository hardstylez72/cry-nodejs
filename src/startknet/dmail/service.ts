import {DefaultRes, StarkNetAccount} from "../account/Account";
import {Call, CallData} from "starknet";
import Jabber  from "jabber";


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

    async sendDmail(req:  SendDmail): Promise<DefaultRes> {
        const tx = this.buildTx()

        let result: DefaultRes = {
            EstimatedMaxFee: '0'
        }

        const fee = await this.acc.Estimate(tx, "dmail.Send")
        result.EstimatedMaxFee = fee.toString()
        result.ContractAddr = this.contractAddr

        if (req.estimateOnly) {
            return result
        }

        result.TxHash = await this.acc.Execute(tx, result.EstimatedMaxFee, "dmail.Send")
            .catch((err) => {throw new Error(`sendDmail failed ${err.message}`)})

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