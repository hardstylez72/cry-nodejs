

export type TokenName = 'ETH' | 'USDC'
export type Address = string
export const tokenMap = new Map<TokenName, Address>()
//https://starkscan.co/contract/0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7
tokenMap.set('ETH', "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7")
tokenMap.set('USDC', "0x053c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8")