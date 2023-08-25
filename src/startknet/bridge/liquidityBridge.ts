import {DefaultRes, StarkNetAccount} from "../account/Account";
import {ethers, Contract, solidityPacked} from "ethers";
import {EthAccount, TxReq} from "../eth/account";
import {ethBridgeAbi} from "./eth.abi";
import {encodeFunctionData, hexToBigInt} from "viem";
import Big from "big.js";
import {EstimateFeeResponse} from "starknet";


export  enum BridgeDirection {
    fromEth = 'fromEth',
    toEth = 'toEth',

}

type LiquidityBridgeReq = {
    direction: BridgeDirection
    accEth: EthAccount
    accStark: StarkNetAccount
    estimateOnly: boolean
    percent: string
    debug?: boolean
}

const ethBridgeAddress = '0xae0ee0a63a2ce6baeeffe56e7714fb4efe48d419'


/*
    balance: 0.045992195477285011 ETH
    percent of balance to swap: 10
    amount to swap: 0.0045992195477285011 ETH
    receive amount: 0.0004568965114853211 ETH
    L1 gas: 0.00414232303624318 ETH

    {
      EstimatedMaxFee: '4142323036243180',
      ContractAddr: '0xae0ee0a63a2ce6baeeffe56e7714fb4efe48d419',
      TxHash: '0x1d41c7a412be1d5be9debcdc11f299a88c9ec06faa491e6745f10dc6f249001c'
    }


    balance: 0.039421658100903105 ETH
    percent of balance to swap: 15
    amount to swap: 0.00591324871513546575 ETH
    L1 gas: 0.004645244183911428 ETH
    receive amount: 0.00126800453122403775 ETH

    {
      EstimatedMaxFee: '4645244183911428',
      ContractAddr: '0xae0ee0a63a2ce6baeeffe56e7714fb4efe48d419',
      TxHash: '0xfc146d36ad0d30c46ccdc898626310a9a19141fff1ab73127e96ad1606ce5b1f'
    }


 */

export const liquidityBridge = async (req: LiquidityBridgeReq): Promise<DefaultRes> => {

    let balance = await req.accEth.getNativeBalance()

    if (req.debug) {
        console.log(`balance: ${balance.div(10e17).toString()} ETH`)
    }

    if (req.percent) {
        const percent = Number(req.percent)
        if (Number.isNaN(percent)) {
            throw new Error('invalid percentage: '+ req.percent)
        }
        if (req.debug) {
            console.log(`percent of balance to swap: ${percent}`)
        }
        balance = balance.div(100).mul(percent)
        if (req.debug) {
            console.log(`amount to swap: ${balance.div(10e17).toString()} ETH`)
        }
    } else {
        if (req.debug) {
            console.log(`amount to swap: ${balance.div(10e17).toString()} ETH`)
        }
    }

    if (req.direction === BridgeDirection.fromEth) {
        return bridgeFromEth(req, balance)
    } else {
        return bridgeToEth(req)
    }
}

const bridgeFromEth = async (req: LiquidityBridgeReq, balance: Big): Promise<DefaultRes> => {

    const gasL1 = await estimateL1Gas(req.accStark, req.accEth, balance)
    console.log(`L1 gas: ${gasL1.total.div(1e18).toString()} ETH` )
    const value  = balance.sub(gasL1.total)

    const gasL2 = await estimateL2Gas(value, req.accStark)
    console.log(`L2 gas: ${gasL2.total.div(1e18).toString()} ETH` )
    const amount = value.sub(gasL2.total)


    const result:DefaultRes = {
        ContractAddr:ethBridgeAddress,
        EstimatedMaxFee: gasL1.total.add(gasL2.total).toString(),
        Gas: {
            price: gasL1.price.add(gasL2.price).toString(),
            limit: gasL1.limit.add(gasL2.limit).toString(),
            total: gasL1.total.add(gasL2.total).toString()
        }
    }

    if (req.estimateOnly) {
        return result
    }

    result.TxHash =  await sendBridgeFromEthTransaction(amount, value, req.accEth, req.accStark, gasL1, req.debug)

    if (req.debug) {
        console.log(`tx: https://etherscan.io/tx/${result.TxHash}`)
    }

    return result
}

type Gas = {
    total: Big
    limit: Big
    price: Big
}

const toBigInt = (b: Big) :bigint => {
    return BigInt(b.round().toString())
}

const toString = (b: Big) :string => {
    return b.round().toString()
}

const sendBridgeFromEthTransaction = async (amount: Big, value: Big,  accEth: EthAccount, accStark: StarkNetAccount, gas: Gas, debug?: boolean): Promise<string>=> {
    const contract = new Contract(ethBridgeAddress, ethBridgeAbi, accEth.w)

    //@ts-ignore
    const starkPub = hexToBigInt(accStark.pub)

    if (debug) {
        console.log(`amount to bridge ${amount.div(10e17).toString()}`)
    }

    const opt = {
        value: toBigInt(value),
        gasLimit: toBigInt(gas.limit),
        maxFeePerGas: toBigInt(gas.price),
        maxPriorityFeePerGas: 5e7,
    }

    const res = await contract['deposit'].send(toBigInt(amount),starkPub, opt)
    return res.hash
}


const  estimateL2Gas = async (amount: Big, accStark: StarkNetAccount): Promise<Gas> => {

    const fee = await accStark.provider.estimateMessageFee({
        from_address: ethBridgeAddress,
        to_address: '0x073314940630fd6dcda0d772d4c972c4e0a9946bef9dabf4ef84eda8ef542b82',
        entry_point_selector: "handle_deposit",
        payload: [accStark.pub, amount.toString(), '0']
    });


    return {
        //@ts-ignore
        price: new Big(fee.gas_price),
        //@ts-ignore
        total: new Big(fee.overall_fee),
        //@ts-ignore
        limit: new Big(fee.gas_usage)
    };

}

const estimateL1Gas = async (accStark: StarkNetAccount, accEth: EthAccount, balance: Big): Promise<Gas> => {

    balance = balance.div(2)

    const contract = new Contract(ethBridgeAddress, ethBridgeAbi, accEth.w)

    const block = await accEth.provider.getBlock('latest')
    const fee = await accEth.provider.getFeeData()

    let baseFee: bigint = BigInt(0)
    if (block && block.baseFeePerGas && fee.maxPriorityFeePerGas) {
        baseFee = BigInt(block.baseFeePerGas)
    }

    //@ts-ignore
    const gasLimit = await contract['deposit'].estimateGas(BigInt(balance.mul(0.5).round().toString()), hexToBigInt(accStark.pub), {
            value: BigInt(balance.round().toString()),
            maxPriorityFeePerGas: 1e8,
            maxFeePerGas: baseFee,
        })

    const gl  = new Big(gasLimit.toString()).mul(1.2).round()
    const gp = new Big(baseFee.toString()).add(5e7)

    let gas: Big
    if (baseFee) {
         gas = gl.mul(gp)
    } else {
        throw new Error('network fee estimation failed')
    }


    return {
        total: gas.round(),
        limit: gl,
        price: gp
    }
}


const bridgeToEth = async (req: LiquidityBridgeReq): Promise<DefaultRes> => {
    throw new Error('not supported yet')
}