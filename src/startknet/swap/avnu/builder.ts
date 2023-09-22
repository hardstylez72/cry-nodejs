
import {SwapBuilder} from "../swapper";
import {StarkNetAccount} from "../../account/Account";
import {defaultDeadline, retryOpt, Swap, SwapRequest} from "../../halp";
import {Address, tokenMap, TokenName} from "../../tokens";
import {rateCalc, useSlippage} from "../slippage";
import {fetchBuildExecuteTransaction, fetchQuotes, Quote, QuoteRequest} from "@avnu/avnu-sdk";

export class BuilderAvnuSwap implements SwapBuilder {

    private PRODUCTION_BASE_URL = 'https://starknet.api.avnu.fi'
    debug = false
    protected router: string = '0x04270219d365d6b017231b52e92b3fb5d7c8378b05e9abc97724537a80e93b0f'
    protected account: StarkNetAccount

    constructor(account: StarkNetAccount) {
        this.account = account
    }
    async buildCallData(req: SwapRequest): Promise<Swap> {

        const from = tokenMap.get(req.fromToken)
        if (!from) {
            throw new Error(`token: ${req.fromToken} is not supported`)
        }

        const to = tokenMap.get(req.toToken)
        if (!to) {
            throw new Error(`token: ${req.toToken} is not supported`)
        }

        const params:QuoteRequest = {
            sellTokenAddress: from,
            buyTokenAddress:to,
            sellAmount: BigInt(req.amount),
        }

        const quotes = await fetchQuotes(params, {baseUrl: this.PRODUCTION_BASE_URL})
        const quote = this.bestQuote(quotes)
        const tx = await fetchBuildExecuteTransaction(quote.quoteId,"0x0", this.account.pub, Number(req.slippage), {baseUrl: this.PRODUCTION_BASE_URL} )

        const rate = rateCalc(req.fromToken, req.toToken, req.amount, quote.buyAmount.toString())

        return {cd: tx, rate: Number(rate)}
    }

    private bestQuote(quotes: Quote[]): Quote {
        if (quotes.length === 0) {
            throw new Error(`no quotes`)
        }
        return quotes[0]
    }
}