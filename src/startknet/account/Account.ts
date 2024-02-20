import {Account, Call, RpcProvider} from "starknet";

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

    Execute(cd: Call | Call[], fee: string, op: string): Promise<string>
    Estimate(tx: Call | Call[], op: string): Promise<string>

     nonce(): Promise<string>

     provider: RpcProvider
     acc: Account
     pub: string

     proxy?: string
}