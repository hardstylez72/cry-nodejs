import {
   CairoVersion, Call,
  CallData,
  ec,
  hash, RpcProvider,
  TransactionType,
  // Account
} from "starknet";

import {Account} from '../index'
import {DefaultRes, StarkNetAccount} from "./Account";
import {retryAsyncDecorator} from "ts-retry/lib/cjs/retry/utils";
import {retryOpt} from "../halp";
import {StarkNetProvider} from "../provider";

const  argentProxyClassHash = "0x25ec026985a3bf9d0cc1fe17326b245dfdc3ff89b8fde106542a3ea56c5a918";
const  accountClassHash = "0x033434ad846cdd5f23eb73ff09fe6fddd568284a0fb7d1be20ee482f044dabe2";

export class UrgentAccount implements StarkNetAccount {


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
    this.acc = new Account(provider.provider, this.pub, this.pk,v);
    this.proxy = provider.proxy
  }

  async Estimate(tx: Call, op: string): Promise<string> {
    return this.estimate(tx, op)
  }

  private async estimate(tx: Call, op: string): Promise<string> {

    const nonce = await this.nonce()
    const fee = await this.acc.estimateInvokeFee(tx, {blockIdentifier: 'latest' ,nonce: nonce, skipExecute: true, skipValidate: false})
        .catch((err) => {
          throw new Error(`${op} failed ${err.message}`)
        })

    if (!fee || !fee.suggestedMaxFee) {
      throw new Error(`${op} empty resp`)
    }

    return fee.suggestedMaxFee.toString()
  }

  async Execute(cd: Call, fee: string, op: string): Promise<string> {
    return this.execute(cd, fee, op)
  }

  private async execute(cd: Call, fee: string, op: string): Promise<string> {

    const nonce = await this.nonce()

    const res = await this.acc.execute(cd, undefined, {maxFee: fee, nonce: nonce})
        .catch((err) => {throw new Error(`${op} failed ${err.message}`)})

    if  (!res.transaction_hash) {
      throw new Error(`${op} empty response`)
    }
    return res.transaction_hash
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



  GetPubKey(): string {
    return getUrgentPub(this.pk)
  }
}

export const getUrgentPub = (pk: string): string => {
    const pubKey = ec.starkCurve.getStarkKey(pk);

    const ConstructorCallData = CallData.compile({
      implementation: accountClassHash,
      selector: hash.getSelectorFromName("initialize"),
      calldata: CallData.compile({ signer: pubKey, guardian: "0" }),
    });

    return hash.calculateContractAddressFromHash(
        pubKey,
        argentProxyClassHash,
        ConstructorCallData,
        0
    );
}