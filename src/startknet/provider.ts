import {RpcProvider as MakeRPC} from "./index.js";
import { RpcProvider, buildUrl} from "starknet";
import axios, {AxiosInstance, CreateAxiosDefaults} from "axios";
import {SocksProxyAgent} from "socks-proxy-agent";


export class StarkNetProvider {


    provider: RpcProvider
    protected httpClient: AxiosInstance

    proxy?: string
    constructor(rpc?: string, proxy?: string) {

        const node = 'https://starknet-mainnet.public.blastapi.io/rpc/'
        const v = 'v0_6'
        //@ts-ignore
        this.provider =  new MakeRPC({
            nodeUrl: node ,
            rpcVersion: v,
        });

        this.proxy = proxy

        let options = {
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

        const fetch = async (method, params, id = 0): Promise<any> => {

            if (method === 'starknet_estimateFee') {
                params.simulation_flags =[]
            }

            const rpcRequestBody = {
                id,
                jsonrpc: "2.0",
                method,
                ...params && { params }
            };



            const url = node + v
            const body = JSON.stringify(rpcRequestBody);

            try {
                const res = await this.httpClient.request({url: url, data: body, method: "post"})
                return res.data
            } catch (e) {
                console.error('provider.fetch error: , ', e)
            }
        }
        this.provider.fetch = fetch
    }
}