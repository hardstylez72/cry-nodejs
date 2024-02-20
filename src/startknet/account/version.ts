import {Contract, RpcProvider} from "starknet";
import {ABI} from "./abi";


export const getCairoVersion = async (addr: string, provider: RpcProvider): Promise<number> => {
    const contract = new Contract(ABI, addr, provider)
    const response: any = await contract.call("get_impl_version")
    const s = Buffer.from(response.res.toString(16), 'hex').toString('utf-8')

    // 000.000.010

    const parts = s.split(".")
    if (!parts.length) {
        return 0
    }

    const last = parts[parts.length - 1]
    return Number("0b" + last)
}