// Collection of functions for Braavos account creation
// coded with Starknet.js v5.11.1, 01/jun/2023

import {
  BigNumberish,
  CairoVersion,
  CallData,
  Calldata,
  DeployAccountContractPayload,
  DeployAccountContractTransaction,
  DeployContractResponse,
  EstimateFeeDetails,
  InvocationsSignerDetails,
  RawCalldata,
  constants,
  ec,
  hash,
  num,
  stark,
  Call,
  RpcProvider,
} from 'starknet';

import {Account} from '../index'

import {DefaultRes, StarkNetAccount} from "./Account";
import {retryAsyncDecorator} from "ts-retry/lib/cjs/retry/utils";
import {retryOpt} from "../halp";
import {StarkNetProvider} from "../provider";

const BraavosProxyClassHash: BigNumberish =
  '0x03131fa018d520a037686ce3efddeab8f28895662f019ca3ca18a626650f7d1e';
const BraavosInitialClassHash = '0x5aa23d5bb71ddaa783da7ea79d405315bafa7cf0387a74f4593578c3e9e6570';
const BraavosAccountClassHash = '0x2c2b8f559e1221468140ad7b2352b1a5be32660d0bf1a3ae3a054a4ec5254e4'; // will probably change over time



export class BraavosAccount implements StarkNetAccount {

  //@ts-ignore
  provider: RpcProvider
  //@ts-ignore
  acc: Account
  pk: string
  pub: string
  proxy?: string
  constructor(provider: StarkNetProvider, pk: string, v: CairoVersion = '0') {
    this.provider = provider.provider
    this.pk = pk
    this.pub = this.GetPubKey()
    this.acc = new Account(this.provider, this.pub, this.pk, v);
    this.proxy = provider.proxy
  }

  async nonce(): Promise<string> {
    return this.provider.getNonceForAddress(this.pub, 'latest')
  }

  async IsAccountDeployed(): Promise<boolean> {

    try {
      const nonce = await this.provider.getNonceForAddress(this.pub, 'latest')

      return nonce !== "0x0"
    } catch (e) {
      console.log(e)
      return false
    }
  }

  async Estimate(tx: Call | Call[], op: string): Promise<string> {
    return retryAsyncDecorator(this.estimate.bind(this), retryOpt)(tx, op)
  }

  private async estimate(tx: Call| Call[], op: string): Promise<string> {

    const nonce = await this.nonce()

    const fee = await this.acc.estimateFee(tx, {blockIdentifier: 'latest',  skipValidate: false, nonce})
        .catch((err) => {
          throw new Error(`${op} failed ${err.message}`)
        })

    if (!fee || !fee.suggestedMaxFee) {
      throw new Error(`${op} empty resp`)
    }

    return fee.suggestedMaxFee.toString()
  }

  async Execute(cd: Call| Call[], fee: string, op: string): Promise<string> {
    return retryAsyncDecorator(this.execute.bind(this), retryOpt)(cd, fee, op)
  }

  private async execute(cd: Call| Call[], fee: string, op: string): Promise<string> {
    const res = await this.acc.execute(cd, undefined, {maxFee: fee})

    if  (!res.transaction_hash) {
      throw new Error(`${op} empty response`)
    }
    return res.transaction_hash
  }



  GetPubKey(): string {
    return getBraavosPub(this.pk)
  }
}

export const getBraavosPub = (pk: string): string => {
  const publicKey = ec.starkCurve.getStarkKey(pk)

  const ProxyConstructorCallData = CallData.compile({
    implementation_address: BraavosInitialClassHash,
    initializer_selector: hash.getSelectorFromName('initializer'),
    calldata: [...CallData.compile({ public_key: publicKey })],
  });

  return hash.calculateContractAddressFromHash(
      publicKey,
      BraavosProxyClassHash,
      ProxyConstructorCallData,
      0
  );
}
