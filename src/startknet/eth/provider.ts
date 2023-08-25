import {SocksProxyAgent} from "socks-proxy-agent";
import {JsonRpcProvider} from "ethers";
import {providers} from "web3";


export class EthProvider {
    provider: JsonRpcProvider
    constructor(rpc: string, proxy?: string) {

        const options: any = {
            url: rpc,
        }

        if (proxy) {
            const sub = proxy.split(":")
            if (sub.length != 4) {
                throw new Error('proxy has invalid format: ' + proxy)
            }
            options.httpAgent = new SocksProxyAgent(`socks5://${sub[2]}:${sub[3]}@${sub[0]}:${sub[1]}`);
            options.httpsAgent = new SocksProxyAgent(`socks5://${sub[2]}:${sub[3]}@${sub[0]}:${sub[1]}`);
        }

        this.provider = new JsonRpcProvider(options.url, undefined, options);
    }
}