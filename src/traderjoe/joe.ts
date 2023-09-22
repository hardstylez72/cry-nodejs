import { RouteV2, TradeV2, PairV2, Bin, LB_ROUTER_V21_ADDRESS, LBRouterV21ABI } from '@traderjoe-xyz/sdk-v2'
import {
  Token,
  ChainId,
  WNATIVE,
  TokenAmount
}  from '@traderjoe-xyz/sdk-core'
import { JsonRpcProvider } from 'ethers'
import {Web3} from 'web3'

import  { createPublicClient, http, encodeFunctionData } from 'viem'
import { arbitrum, } from 'viem/chains'

export interface estimateSwapReq {
  fromToken: TokenName
  toToken: TokenName
  chainRPC: string
  amount: string
  recipient: string
}

export interface estimateSwapRes {
  data: string
  value: string
  contractAddr: string
}


type TokenName = 'ETH' | 'STG' | 'USDT' | 'USDC' | 'USDCBridged'


const tokenChainKey = (token: TokenName, chain: number) => token + chain.toString()

const tokenChainMap = new Map<string, Token>()
tokenChainMap.set(tokenChainKey('ETH', ChainId.ARBITRUM_ONE), WNATIVE[ChainId.ARBITRUM_ONE])
tokenChainMap.set(tokenChainKey('STG', ChainId.ARBITRUM_ONE), new Token(
  ChainId.ARBITRUM_ONE,
  '0x6694340fc020c5e6b96567843da2df01b2ce1eb6',
  18,
  'STG',
))
tokenChainMap.set(tokenChainKey('USDT', ChainId.ARBITRUM_ONE), new Token(
    ChainId.ARBITRUM_ONE,
    '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
    6,
    'USDT',
))

tokenChainMap.set(tokenChainKey('USDCBridged', ChainId.ARBITRUM_ONE), new Token(
    ChainId.ARBITRUM_ONE,
    '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
    6,
    'USDCBridged',
))

tokenChainMap.set(tokenChainKey('USDC', ChainId.ARBITRUM_ONE), new Token(
    ChainId.ARBITRUM_ONE,
    '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
    6,
    'USDC',
))
export const getSwapData = async (req:estimateSwapReq): Promise<estimateSwapRes>=> {

  let chainId = -1
  try {

    const provider = new JsonRpcProvider(req.chainRPC)
    const network = await provider._detectNetwork()
    chainId = Number(network.chainId.toString())
    if (Number.isNaN(chainId)) {
      throw new Error( 'invalid chain id')
    }
  } catch (e) {
    throw new Error(`invalid rpc ${req.chainRPC}`)
  }

  const fromToken = tokenChainMap.get(tokenChainKey(req.fromToken, chainId))
  if (!fromToken) {
    throw new Error(`token from ${req.fromToken} is not supported`)
  }
  const toToken = tokenChainMap.get(tokenChainKey(req.toToken, chainId))
  if (!toToken) {
    throw new Error(`token to ${req.toToken} is not supported`)
  }

  const client = createPublicClient({
    chain: arbitrum,
    transport: http()
  })

  // get all [Token, Token] combinations
  const allTokenPairs = PairV2.createAllTokenPairs(
    fromToken,
    toToken,
    [fromToken,toToken]
  )
  const allPairs = PairV2.initPairs(allTokenPairs) // console.debug('allPairs', allPairs)

  // routes to consider in finding the best trade
  const allRoutes = RouteV2.createAllRoutes(allPairs, fromToken, toToken) // console.debug('allRoutes', allRoutes)

  const am = new TokenAmount(fromToken, req.amount)
  const trades = await TradeV2.getTradesExactIn(
    allRoutes,
    am,
    toToken,
      req.fromToken === 'ETH',
    req.toToken === 'ETH',
    client,
    chainId
  )

  const allowedTrades: TradeV2[] = []
  if (trades && Array.isArray(trades))  {
    trades.forEach((t) => {
      if (t) {
        allowedTrades.push(t)
      }
    })
  }

  const trade = TradeV2.chooseBestTrade(allowedTrades, true)
  if (!trade) {
    throw new Error('best trade not found')
  }

  const deadline = (new Date()).getTime() + 10

 const res = await trade.swapCallParameters({
    recipient: req.recipient,
    ttl: 100,
    deadline: deadline,
    allowedSlippage: trade.priceImpact,
    feeOnTransfer: false,
  })

  const web3 = new Web3()

  const data = encodeFunctionData({
    abi: LBRouterV21ABI,
    // @ts-ignore
    args: res.args,
    // @ts-ignore
    functionName: res.methodName,

  })

  return {
    contractAddr: LB_ROUTER_V21_ADDRESS[chainId],
    value: res.value,
    data: data,
  }
}

