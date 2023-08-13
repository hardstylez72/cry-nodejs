import {
  Account, buildUrl,
  CallData,
  constants,
  ec,
  hash,
  Provider,
  RpcProvider,
  SequencerHttpMethod,
  SequencerProvider,
  TransactionType
} from "starknet";
import {SocksProxyAgent, SocksProxyAgentOptions} from 'socks-proxy-agent';
import axios, {AxiosInstance, CreateAxiosDefaults} from 'axios';

export const MainNet = "https://alpha-mainnet.starknet.io/"

interface DefaultRes {
  EstimatedMaxFee: string

  ContractAddr?: string
  TxHash?: string
}

export class Client {

  private readonly argentProxyClassHash = "0x25ec026985a3bf9d0cc1fe17326b245dfdc3ff89b8fde106542a3ea56c5a918";
  private readonly accountClassHash = "0x033434ad846cdd5f23eb73ff09fe6fddd568284a0fb7d1be20ee482f044dabe2";

  protected provider: SequencerProvider
  private httpClient: AxiosInstance
  constructor(rpc: string, proxy?: string) {

    this.provider =  new SequencerProvider({baseUrl: rpc });

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

  async IsAccountDeployed(privateKey:string): Promise<boolean> {
    const ca = this.GetDeployedPubKey(privateKey)
    const account = new Account(this.provider, ca, privateKey);

    try {
      const nonce = await account.getNonce()

      return nonce !== "0x0"
    } catch (e) {
      console.log(e)
      return false
    }

  }
  async DeployAccount(privateKey: string): Promise<DefaultRes> {
    return this.deployAccount(privateKey, false)
  }
  async DeployAccountEstimate(privateKey: string) {
    return this.deployAccount(privateKey, true)
  }
  private async deployAccount(privateKey: string, estimateOnly: boolean): Promise<DefaultRes> {
    const address =  this.GetDeployedPubKey(privateKey)
    const account = new Account(this.provider, address, privateKey);
    const publicKey = this.getPub(privateKey)

    const cd = CallData.compile({
      implementation: this.accountClassHash,
      selector: hash.getSelectorFromName("initialize"),
      calldata: CallData.compile({signer: publicKey, guardian: "0"}),
    })

    const fee = await account.getSuggestedMaxFee({
      type: TransactionType.DEPLOY_ACCOUNT,
      payload: {
        classHash: this.argentProxyClassHash,
        constructorCalldata: cd,
        addressSalt: publicKey,
        contractAddress: address,
      }
    }, {})

    if (estimateOnly) {
      return {EstimatedMaxFee: fee.toString()}
    }

    const data = {
      classHash: this.argentProxyClassHash,
      constructorCalldata: cd,
      contractAddress: address,
      addressSalt: publicKey
    };

    const res = await account.deployAccount(data)

    return {
      EstimatedMaxFee: fee.toString(),
      ContractAddr: address,
      TxHash: res.transaction_hash
    }
  }

  private getPub(privateKey: string) {
    // хуй знает что это за херня, нужна для деплоя аккаунта
   return  ec.starkCurve.getStarkKey(privateKey);
  }
  GetDeployedPubKey(privateKey): string {
    const pubKey = ec.starkCurve.getStarkKey(privateKey);

    const ConstructorCallData = CallData.compile({
      implementation: this.accountClassHash,
      selector: hash.getSelectorFromName("initialize"),
      calldata: CallData.compile({ signer: pubKey, guardian: "0" }),
    });

    return hash.calculateContractAddressFromHash(
        pubKey,
        this.argentProxyClassHash,
        ConstructorCallData,
        0
    );
  }
}