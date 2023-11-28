import axios, {AxiosInstance, CreateAxiosDefaults} from "axios";
import {SocksProxyAgent} from "socks-proxy-agent";
import {tokenMap, TokenName} from "../../tokens";

export interface Quote {
    amount: string;
    route:  Route[];
}

export interface Route {
    pool_key:         PoolKey;
    sqrt_ratio_limit: string;
}

export interface PoolKey {
    token0:       string;
    token1:       string;
    fee:          string;
    tick_spacing: number;
    extension:    string;
}


export class Quoter {
    private cli: AxiosInstance
    constructor(proxy?: string) {

        let options = {
            baseURL: "https://mainnet-api.ekubo.org",
            timeout: 30000,
            withCredentials: true,
            headers: { "Content-Type": "application/json" },

        } as CreateAxiosDefaults

        if (proxy) {
            const sub = proxy.split(":")
            if (sub.length != 4) {
                throw new Error('proxy has invalid format: ' + proxy)
            }
            options.httpAgent = new SocksProxyAgent(`socks5://${sub[2]}:${sub[3]}@${sub[0]}:${sub[1]}`);
            options.httpsAgent = new SocksProxyAgent(`socks5://${sub[2]}:${sub[3]}@${sub[0]}:${sub[1]}`);
        }

        this.cli = axios.create(options)
    }

    public async Quote(fromToken: TokenName, toToken: TokenName, am: string): Promise<Quote> {

        const fromTokenAddr = tokenMap.get(fromToken)
        if (!fromTokenAddr) {
            throw new Error(`token: ${fromToken} not supported`)
        }

        const toTokenAddr = tokenMap.get(toToken)
        if (!toTokenAddr) {
            throw new Error(`token: ${fromToken} not supported`)
        }

        const url = `https://mainnet-api.ekubo.org/quote/${am}/${fromTokenAddr}/${toTokenAddr}`

        const res = await this.cli.get(url)

        return res.data
    }

}