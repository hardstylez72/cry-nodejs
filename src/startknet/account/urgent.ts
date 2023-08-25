import {
  Account,
  CallData,
  ec,
  hash,
  SequencerProvider,
  TransactionType
} from "starknet";
import {DefaultRes, StarkNetAccount} from "./Account";

const  argentProxyClassHash = "0x25ec026985a3bf9d0cc1fe17326b245dfdc3ff89b8fde106542a3ea56c5a918";
const  accountClassHash = "0x033434ad846cdd5f23eb73ff09fe6fddd568284a0fb7d1be20ee482f044dabe2";

export class UrgentAccount implements StarkNetAccount {


  provider: SequencerProvider
  acc: Account
  pk: string
  pub: string
  constructor(provider: SequencerProvider, pk: string) {
    this.provider = provider
    this.pk = pk
    this.pub = this.GetPubKey()
    this.acc = new Account(this.provider, this.pub, this.pk);
  }

  async IsAccountDeployed(): Promise<boolean> {

    try {
      const nonce = await this.acc.getNonce()

      return nonce !== "0x0"
    } catch (e) {
      console.log(e)
      return false
    }

  }

  async DeployAccount(): Promise<DefaultRes> {
    return this.deployAccount( false)
  }
  async DeployAccountEstimate() {
    return this.deployAccount(true)
  }
  private async deployAccount(estimateOnly: boolean): Promise<DefaultRes> {
    const address =  this.pub
    const account = new Account(this.provider, this.pub, this.pk);
    const salt = this.getSalt(this.pk)

    const cd = CallData.compile({
      implementation: accountClassHash,
      selector: hash.getSelectorFromName("initialize"),
      calldata: CallData.compile({signer: salt, guardian: "0"}),
    })

    const fee = await account.getSuggestedMaxFee({
      type: TransactionType.DEPLOY_ACCOUNT,
      payload: {
        classHash: argentProxyClassHash,
        constructorCalldata: cd,
        addressSalt: salt,
        contractAddress: address,
      }
    }, {})

    if (estimateOnly) {
      return {EstimatedMaxFee: fee.toString()}
    }

    const data = {
      classHash: argentProxyClassHash,
      constructorCalldata: cd,
      contractAddress: address,
      addressSalt: salt
    };

    const res = await account.deployAccount(data)

    return {
      EstimatedMaxFee: fee.toString(),
      ContractAddr: address,
      TxHash: res.transaction_hash
    }
  }

  private getSalt(privateKey: string) {
   return ec.starkCurve.getStarkKey(privateKey);
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