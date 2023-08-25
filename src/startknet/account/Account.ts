import {Account, Provider, SequencerProvider} from "starknet";
import {StarkNetProvider} from "../provider";

export interface DefaultRes {
    EstimatedMaxFee: string
    Gas?: {
        limit: string,
        price: string,
        total: string
    }
    ContractAddr?: string
    TxHash?: string
}
export  interface StarkNetAccount {
     IsAccountDeployed(): Promise<boolean>
     DeployAccount(): Promise<DefaultRes>
     DeployAccountEstimate()
     GetPubKey(): string

     provider: SequencerProvider
     acc: Account
     pub: string
}