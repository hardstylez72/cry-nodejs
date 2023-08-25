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
  Provider,
  RawCalldata,
  constants,
  ec,
  hash,
  num,
  stark, SequencerProvider, Account, TransactionType,
} from 'starknet';
import {DefaultRes, StarkNetAccount} from "./Account";

const BraavosProxyClassHash: BigNumberish =
  '0x03131fa018d520a037686ce3efddeab8f28895662f019ca3ca18a626650f7d1e';
const BraavosInitialClassHash = '0x5aa23d5bb71ddaa783da7ea79d405315bafa7cf0387a74f4593578c3e9e6570';
const BraavosAccountClassHash = '0x2c2b8f559e1221468140ad7b2352b1a5be32660d0bf1a3ae3a054a4ec5254e4'; // will probably change over time



export class BraavosAccount implements StarkNetAccount {


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

    const fee = await estimateBraavosAccountDeployFee(this.pk, this.acc)
    if (estimateOnly) {
      return {EstimatedMaxFee: fee.toString()}
    }

    const res = await deployBraavosAccount(this.pk, this.acc, fee)

    return {
      EstimatedMaxFee: fee.toString(),
      ContractAddr: address,
      TxHash: res.transaction_hash
    }
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

// ниже просто скопировал с офф репы:))

export function getBraavosSignature(
  BraavosProxyAddress: BigNumberish,
  BraavosProxyConstructorCallData: RawCalldata,
  starkKeyPubBraavos: BigNumberish,
  version: BigNumberish,
  max_fee: BigNumberish,
  chainId: constants.StarknetChainId,
  nonce: BigNumberish,
  privateKeyBraavos: BigNumberish
): string[] {
  const txnHash = hash.calculateDeployAccountTransactionHash(
    BraavosProxyAddress,
    BraavosProxyClassHash,
    BraavosProxyConstructorCallData,
    starkKeyPubBraavos,
    version,
    max_fee,
    chainId,
    nonce
  );

  const parsedOtherSigner = [0, 0, 0, 0, 0, 0, 0];
  const { r, s } = ec.starkCurve.sign(
    hash.computeHashOnElements([txnHash, BraavosAccountClassHash, ...parsedOtherSigner]),
    num.toHex(privateKeyBraavos)
  );
  const signature = [
    r.toString(),
    s.toString(),
    BraavosAccountClassHash.toString(),
    ...parsedOtherSigner.map((e) => e.toString()),
  ];

  return signature;
}

const calcBraavosInit = (starkKeyPubBraavos: string) =>
  CallData.compile({ public_key: starkKeyPubBraavos });
const BraavosProxyConstructor = (BraavosInitializer: Calldata) =>
  CallData.compile({
    implementation_address: BraavosInitialClassHash,
    initializer_selector: hash.getSelectorFromName('initializer'),
    calldata: [...BraavosInitializer],
  });

export function calculateAddressBraavos(privateKeyBraavos: BigNumberish): string {
  const starkKeyPubBraavos = ec.starkCurve.getStarkKey(num.toHex(privateKeyBraavos));
  const BraavosInitializer = calcBraavosInit(starkKeyPubBraavos);
  const BraavosProxyConstructorCallData = BraavosProxyConstructor(BraavosInitializer);

  return hash.calculateContractAddressFromHash(
    starkKeyPubBraavos,
    BraavosProxyClassHash,
    BraavosProxyConstructorCallData,
    0
  );
}

async function buildBraavosAccountDeployPayload(
  privateKeyBraavos: BigNumberish,
  {
    classHash,
    addressSalt,
    constructorCalldata,
    contractAddress: providedContractAddress,
  }: DeployAccountContractPayload,
  { nonce, chainId, version, maxFee }: InvocationsSignerDetails
): Promise<DeployAccountContractTransaction> {
  const compiledCalldata = CallData.compile(constructorCalldata ?? []);
  const contractAddress = providedContractAddress ?? calculateAddressBraavos(privateKeyBraavos);
  const starkKeyPubBraavos = ec.starkCurve.getStarkKey(num.toHex(privateKeyBraavos));
  const signature = getBraavosSignature(
    contractAddress,
    compiledCalldata,
    starkKeyPubBraavos,
    version,
    maxFee,
    chainId,
    nonce,
    privateKeyBraavos
  );
  return {
    classHash,
    addressSalt,
    constructorCalldata: compiledCalldata,
    signature,
  };
}

export async function estimateBraavosAccountDeployFee(
  privateKeyBraavos: BigNumberish,
  provider: Provider,
  { blockIdentifier, skipValidate }: EstimateFeeDetails = {}
): Promise<BigNumberish> {
  const version = hash.feeTransactionVersion;
  const nonce = constants.ZERO;
  const chainId = await provider.getChainId();
  const cairoVersion: CairoVersion = '0';
  const starkKeyPubBraavos = ec.starkCurve.getStarkKey(num.toHex(privateKeyBraavos));
  const BraavosProxyAddress = calculateAddressBraavos(privateKeyBraavos);
  const BraavosInitializer = calcBraavosInit(starkKeyPubBraavos);
  const BraavosProxyConstructorCallData = BraavosProxyConstructor(BraavosInitializer);

  const payload = await buildBraavosAccountDeployPayload(
    privateKeyBraavos,
    {
      classHash: BraavosProxyClassHash.toString(),
      addressSalt: starkKeyPubBraavos,
      constructorCalldata: BraavosProxyConstructorCallData,
      contractAddress: BraavosProxyAddress,
    },
    {
      nonce,
      chainId,
      version,
      walletAddress: BraavosProxyAddress,
      maxFee: constants.ZERO,
      cairoVersion,
    }
  );

  const response = await provider.getDeployAccountEstimateFee(
    { ...payload },
    { version, nonce },
    blockIdentifier,
    skipValidate
  );
  const suggestedMaxFee = stark.estimatedFeeToMaxFee(response.overall_fee);

  return suggestedMaxFee;
}

export async function deployBraavosAccount(
  privateKeyBraavos: BigNumberish,
  provider: Provider,
  max_fee?: BigNumberish
): Promise<DeployContractResponse> {
  const nonce = constants.ZERO;
  const starkKeyPubBraavos = ec.starkCurve.getStarkKey(num.toHex(privateKeyBraavos));
  console.log('pubkey =', starkKeyPubBraavos.toString());
  const BraavosProxyAddress = calculateAddressBraavos(privateKeyBraavos);
  const BraavosInitializer = calcBraavosInit(starkKeyPubBraavos);
  const BraavosProxyConstructorCallData = BraavosProxyConstructor(BraavosInitializer);
  max_fee ??= await estimateBraavosAccountDeployFee(privateKeyBraavos, provider);
  const version = hash.transactionVersion;
  const signatureBraavos = getBraavosSignature(
    BraavosProxyAddress,
    BraavosProxyConstructorCallData,
    starkKeyPubBraavos,
    version,
    max_fee,
    await provider.getChainId(),
    nonce,
    privateKeyBraavos
  );

  return provider.deployAccountContract(
    {
      classHash: BraavosProxyClassHash.toString(),
      addressSalt: starkKeyPubBraavos,
      constructorCalldata: BraavosProxyConstructorCallData,
      signature: signatureBraavos,
    },
    {
      nonce,
      maxFee: max_fee,
      version,
    }
  );
}


