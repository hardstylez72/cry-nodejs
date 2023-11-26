import {Account, Call, Provider, SequencerProvider} from "starknet";
import {StarkNetProvider} from "../provider";
import {TokenName} from "../tokens";

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

    Execute(cd: Call, fee: string, op: string): Promise<string>
    Estimate(tx: Call, op: string): Promise<string>

     provider: SequencerProvider
     acc: Account
     pub: string
}