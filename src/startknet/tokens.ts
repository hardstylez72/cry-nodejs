

export type TokenName = 'ETH' | 'USDC' | 'USDT' | 'DAI'
export type Address = string
export const tokenMap = new Map<TokenName, Address>()
//https://starkscan.co/contract/0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7
tokenMap.set('ETH', "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7")
tokenMap.set('USDC', "0x53c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8")
tokenMap.set('USDT', "0x68f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8")
tokenMap.set('DAI', "0xda114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3")



