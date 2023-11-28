
import {SwapBuilder} from "../swapper";
import {StarkNetAccount} from "../../account/Account";
import {defaultDeadline, Swap, SwapRequest} from "../../halp";
import {tokenMap, TokenName,} from "../../tokens";
import {rateCalc, useSlippage} from "../slippage";
import {Quoter} from "./quoter";
import {Abi, cairo, Call, CallData, Contract,  uint256} from "starknet";
import {routerAbi} from "./abi_router";
import {ERC20_ABI} from "../../erc20/abi";


// https://starkscan.co/tx/0x240b3d8577ece582f1641821b87dfb14819c0283b2df1630ee62c8364a25c79
export class EkuboSwap implements SwapBuilder {

    debug = false
    protected quoter: Quoter
    protected router: string = '0x04b3802058cdd4fc4e352e866e2eef5abde7d62e78116ac68b419654cbebc021'
    protected account: StarkNetAccount

    constructor(account: StarkNetAccount) {
        this.account = account
        this.quoter = new Quoter(account.proxy)
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

       const q = await this.quoter.Quote(req.fromToken, req.toToken, req.amount)

        const min = useSlippage(q.amount, req.slippage)

       const contract = new Contract(routerAbi, this.router, this.account.acc)
        const swapp = {
            token_amount:{
                token: from,
                amount: {
                    mag: req.amount,
                    sign: 0,
                }
            },
            route:
                q.route.map((r) => {
                    return {
                        pool_key: {
                            token0: r.pool_key.token0,
                            token1: r.pool_key.token1,
                            fee: r.pool_key.fee,
                            tick_spacing: r.pool_key.tick_spacing,
                            extension: r.pool_key.extension,
                        },
                        sqrt_ratio_limit: r.sqrt_ratio_limit,
                        skip_ahead: 0
                    }
                }),
            calculated_amount_threshold: min,
            recipient: this.router,
        }

        const erc20 = new Contract(ERC20_ABI, from)
        const transferCD = await erc20.populate('transfer', [this.router,  uint256.bnToUint256(req.amount)])
        const swapCD =  await contract.populate('execute', {swap: swapp})
        const clearCD =  await contract.populate('clear', {token: to})


        const rate = rateCalc(req.fromToken, req.toToken, req.amount, min.toString())

        return {cd: [transferCD, swapCD, clearCD], rate: Number(rate)}
    }

}

