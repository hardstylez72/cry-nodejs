import {buildUrl, num, SequencerHttpMethod, SequencerProvider} from "starknet";
import axios, {AxiosInstance, CreateAxiosDefaults} from "axios";
import {SocksProxyAgent} from "socks-proxy-agent";

export const MainNet = "https://alpha-mainnet.starknet.io/"

export class StarkNetProvider {

    provider: SequencerProvider
    protected httpClient: AxiosInstance

    proxy?: string
    constructor(rpc: string, proxy?: string) {

        this.proxy = proxy
        this.provider =  new SequencerProvider({
            baseUrl: rpc ,
            feederGatewayUrl: 'feeder_gateway',
            gatewayUrl: 'gateway',
        });
        let options = {
            baseURL: rpc,
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

        this.httpClient = axios.create(options)

        this.provider.fetch = async (endpoint: string, options?: {
            method?: SequencerHttpMethod;
            body?: any;
            parseAlwaysAsBigInt?: boolean;
        }): Promise<any> => {

            const baseUrl = 'https://alpha-mainnet.starknet.io/'
            const url = buildUrl(baseUrl, "", endpoint);
            const method = options?.method ?? "GET";
            const body = JSON.stringify(options?.body);

            try {
                const res = await this.httpClient.request({url:url, method: method, data: body})
                return res.data
            } catch (e) {
                console.error('provider.fetch error: , ', e)
            }
        }
    }
}