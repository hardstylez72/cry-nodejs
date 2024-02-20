import {Express, Request, Response} from "express";
import {StarkNetProvider} from "./provider";
import {getUrgentPub, UrgentAccount} from "./account/urgent";
import {Approver} from "./erc20/approver";
import {Swapper} from "./swap/swapper";
import {StarkNetAccount} from "./account/Account";
import {BraavosAccount, getBraavosPub} from "./account/braavos";
import * as bip39 from "@scure/bip39";
import {WORDLIST} from "../mnemonic/words";
import * as bip32 from "@scure/bip32";
import * as mStark from "micro-starknet";
import {HDNodeWallet, Mnemonic} from "ethers";
import {BridgeDirection, liquidityBridge} from "./bridge/liquidityBridge";
import {EthProvider} from "./eth/provider";
import {EthAccount} from "./eth/account";
import {Dmail} from "./dmail/service";
import {StarkNetId} from "./mint/starknetid";
import {Transfer} from "./transfer/service";
import {ZkLendPool} from "./pool/zklend";
import {NostraPool} from "./pool/nostra";
import {getCairoVersion} from "./account/version";


enum AccountType {
    UrgentX= 'UrgentX',
    Braavos = 'Braavos'
}

export const registerStarkNetEndpoints = (app: Express) => {
    app.post('/starknet/approve', async (req: Request, res: Response) => {
        console.log('/starknet/approve')
        try {

            const Req = {
                proxy: req.body.proxy,
                rpc: req.body.chainRPC,
                privateKey: req.body.privateKey,
                spender: req.body.spender,
                amount: req.body.amount,
                token: req.body.token,
                account: req.body.account
            }

            const provider = new StarkNetProvider(Req.rpc,  Req.proxy)

            const account = await resolveAccount(Req.account, Req.privateKey, provider)

            const swap = new Approver(account)
            const data = await swap.Approve({
                token: Req.token,
                amount: Req.amount,
                spender: Req.spender,
            })

            res.statusCode = 200
            res.send(JSON.stringify(data))
        } catch (err: any) {
            console.error(err)
            res.statusCode = 500
            res.send(JSON.stringify({error: JSON.stringify(err.message)}))
        }
    })
    app.post('/starknet/swap', async (req: Request, res: Response) => {
        console.log('/starknet/swap')
        try {

            const Req = {
                proxy: req.body.proxy,
                rpc: req.body.chainRPC,
                privateKey: req.body.privateKey,
                fromToken: req.body.fromToken,
                toToken: req.body.toToken,
                amount: req.body.amount,
                estimateOnly: req.body.estimateOnly,
                fee: req.body.fee,
                slippage: req.body.slippage,
                platform: req.body.platform,
                account: req.body.account
            }

            const provider = new StarkNetProvider(Req.rpc,  Req.proxy)

            const account = await resolveAccount(Req.account, Req.privateKey, provider)

            const swap = new Swapper(account)
            const data = await swap.swap({
                amount: Req.amount,
                fee: Req.fee,
                fromToken: Req.fromToken,
                toToken: Req.toToken,
                estimateOnly: Req.estimateOnly,
                slippage: Req.slippage
            }, Req.platform)

            res.statusCode = 200
            res.send(JSON.stringify( data))
        } catch (err: any) {
            console.error(err)
            res.statusCode = 500
            res.send(JSON.stringify({error: JSON.stringify(err.message)}))
        }
    })
    app.post('/starknet/is_account_deployed', async (req: Request, res: Response) => {
        console.log('/starknet/is_account_deployed')
        try {

            const Req = {
                proxy: req.body.proxy,
                rpc: req.body.chainRPC,
                privateKey: req.body.privateKey,
                account: req.body.account
            }

            const provider = new StarkNetProvider(Req.rpc,  Req.proxy)
            const account = await resolveAccount(Req.account, Req.privateKey, provider)
            const data = await account.IsAccountDeployed()

            res.statusCode = 200
            res.send(JSON.stringify({deployed: data}))
        } catch (e) {
            console.error(e)
            res.statusCode = 500
            res.send(JSON.stringify({error: JSON.stringify(e)}))
        }
    })
    app.post('/starknet/account_pub', async (req: Request, res: Response) => {
        console.log('/starknet/account_pub')
        try {

            const Req = {
                privateKey: req.body.privateKey,
                account: req.body.account
            }

            let data: string

            switch (Req.account) {
                case AccountType.Braavos:
                    data = getBraavosPub(Req.privateKey)
                    break
                case AccountType.UrgentX:
                    data = getUrgentPub(Req.privateKey)
                    break
                default:
                    throw new Error(`invalid account type: ${Req.account}`)
            }

            res.statusCode = 200
            res.send(JSON.stringify({publicKey: data}))
        } catch (e) {
            console.error(e)
            res.statusCode = 500
            res.send(JSON.stringify({error: JSON.stringify(e)}))
        }
    })
    app.post('/starknet/generate', async (req: Request, res: Response) => {
        console.log('/starknet/generation')
        try {

            const Req = {
                account: req.body.account,
                count: req.body.count
            }

            const data:any[] = []

            for (let i = 0; i < Req.count; i++) {
                const seed = genMnemonic()


                let pub: string
                let pk: string

                switch (Req.account) {
                    case AccountType.Braavos:
                        pk = getPrivateKeyFromMnemonicBraaaaaavaaaaaasStarkNet(seed)
                        pub = getBraavosPub(pk)
                        break
                    case AccountType.UrgentX:
                        pk = getPrivateKeyFromMnemonicUrgentX(seed)
                        pub = getUrgentPub(pk)
                        break
                    default:
                        throw new Error(`invalid account type: ${Req.account}`)
                }
                data.push({pk: pk,pub: pub,seed: seed})
            }

            res.statusCode = 200
            res.send(JSON.stringify(data))
        } catch (e) {
            console.error(e)
            res.statusCode = 500
            res.send(JSON.stringify({error: JSON.stringify(e)}))
        }
    })
    app.post('/starknet/liquidity-bridge', async (req: Request, res: Response) => {
        console.log('/starknet/liquidity-bridge')
        try {

            const Req = {
                proxy: req.body.proxy,
                pkEth: req.body.pkEth,
                pkStark: req.body.pkStark,
                percent: req.body.percent,
                estimateOnly: req.body.estimateOnly,
                account: req.body.account,
                fromNetwork: req.body.fromNetwork,
                toNetwork: req.body.toNetwork,
            }

            const provider = new StarkNetProvider('',  Req.proxy)

            const account = await resolveAccount(Req.account, Req.pkStark, provider)

            const providerEth = new EthProvider("https://cloudflare-eth.com", Req.proxy)
            const accountEth = new EthAccount(providerEth, Req.pkEth)


            let direction =  BridgeDirection.fromEth
            if (Req.fromNetwork === 'StarkNet') {
                direction = BridgeDirection.toEth
            }

            const data = await liquidityBridge({
                accStark: account,
                direction: direction,
                estimateOnly: Req.estimateOnly,
                debug: true,
                accEth: accountEth,
                percent: Req.percent
            })

            res.statusCode = 200
            res.send(JSON.stringify(data))
        } catch (err: any) {
            console.error(err)
            res.statusCode = 500
            res.send(JSON.stringify({error: JSON.stringify(err.message)}))
        }
    })
    app.post('/starknet/dmail', async (req: Request, res: Response) => {
        console.log('/starknet/dmail')
        try {

            const Req = {
                proxy: req.body.proxy,
                pk: req.body.privateKey,
                account: req.body.account,
                estimateOnly: req.body.estimateOnly,
                rpc: req.body.chainRPC,
            }

            const provider = new StarkNetProvider("",Req.proxy)

            const account = await resolveAccount(Req.account, Req.pk, provider)

            const dmail = new Dmail(account)

            const data = await dmail.sendDmail({
                estimateOnly: Req.estimateOnly,
            })

            res.statusCode = 200
            res.send(JSON.stringify(data))
        } catch (err: any) {
            console.error(err)
            res.statusCode = 500
            res.send(JSON.stringify({error: JSON.stringify(err.message)}))
        }
    })
    app.post('/starknet/mint', async (req: Request, res: Response) => {
        console.log('/starknet/mint')
        try {

            const Req = {
                proxy: req.body.proxy,
                pk: req.body.privateKey,
                account: req.body.account,
                estimateOnly: req.body.estimateOnly,
                rpc: req.body.chainRPC,
            }

            const provider = new StarkNetProvider("",  Req.proxy)

            const account = await resolveAccount(Req.account, Req.pk, provider)

            const dmail = new StarkNetId(account)

            const data = await dmail.mint({
                estimateOnly: Req.estimateOnly,
            })

            res.statusCode = 200
            res.send(JSON.stringify(data))
        } catch (err: any) {
            console.error(err)
            res.statusCode = 500
            res.send(JSON.stringify({error: JSON.stringify(err.message)}))
        }
    })
    app.post('/starknet/transfer', async (req: Request, res: Response) => {
        console.log('/starknet/transfer')
        try {

            const b = getBase(req)

            const Req = {
                toAddr: req.body.toAddr,
                token:  req.body.token,
                amount: req.body.amount,
                ...b
            }

            const provider = new StarkNetProvider("",  b.proxy)
            const account =await resolveAccount(b.account, b.pk, provider)

            const client = new Transfer(account)
            const data = await client.transfer(Req)

            res.statusCode = 200
            res.send(JSON.stringify(data))
        } catch (err: any) {
            console.error(err)
            res.statusCode = 500
            res.send(JSON.stringify({error: JSON.stringify(err.message)}))
        }
    })

    app.post('/starknet/zklend', async (req: Request, res: Response) => {
        console.log('/starknet/zklend')
        try {

            const b = getBase(req)
            const Req = {
                token: req.body.token,
                amount: req.body.amount,
                op: req.body.op,
                ...b
            }

            const provider = new StarkNetProvider(Req.rpc,  Req.proxy)

            const account = await resolveAccount(Req.account, Req.pk, provider)

            const client = new ZkLendPool(account)
            let data = {}
            switch (Req.op) {
                case 'withdraw':
                    data = await client.withdraw({
                        estimateOnly: Req.estimateOnly,
                        token: Req.token,
                        fee: Req.maxFee,
                    })
                    break
                case 'deposit':
                    data = await client.deposit({
                        estimateOnly: Req.estimateOnly,
                        token: Req.token,
                        fee: Req.maxFee,
                        amount: Req.amount,
                    })
                    break
                default:
                    throw new Error(`usupported operation: ${Req.op}`)
            }

            res.statusCode = 200
            res.send(JSON.stringify( data))
        } catch (err: any) {
            console.error(err)
            res.statusCode = 500
            res.send(JSON.stringify({error: JSON.stringify(err.message)}))
        }
    })
    app.post('/starknet/nostra', async (req: Request, res: Response) => {
        console.log('/starknet/nostra')
        try {

            const b = getBase(req)
            const Req = {
                token: req.body.token,
                amount: req.body.amount,
                op: req.body.op,
                ...b
            }

            const provider = new StarkNetProvider(Req.rpc,  Req.proxy)

            const account = await resolveAccount(Req.account, Req.pk, provider)

            const client = new NostraPool(account)
            let data = {}
            switch (Req.op) {
                case 'withdraw':
                    data = await client.withdraw({
                        estimateOnly: Req.estimateOnly,
                        token: Req.token,
                        fee: Req.maxFee,
                    })
                    break
                case 'deposit':
                    data = await client.deposit({
                        estimateOnly: Req.estimateOnly,
                        token: Req.token,
                        fee: Req.maxFee,
                        amount: Req.amount,
                    })
                    break
                default:
                    throw new Error(`usupported operation: ${Req.op}`)
            }

            res.statusCode = 200
            res.send(JSON.stringify( data))
        } catch (err: any) {
            console.error(err)
            res.statusCode = 500
            res.send(JSON.stringify({error: JSON.stringify(err.message)}))
        }
    })
    app.post('/starknet/balance', async (req: Request, res: Response) => {
        console.log('/starknet/balance')
        try {

            const tokenName =  req.body.token
            const {provider} = new StarkNetProvider(req.body.chainRPC, req.body.proxy)
            const am = await Approver.Balance(tokenName, provider, req.body.pub)
            const data = {
                wei: am,
            }

            res.statusCode = 200
            res.send(JSON.stringify( data))
        } catch (err: any) {
            console.error(err)
            res.statusCode = 500
            res.send(JSON.stringify({error: JSON.stringify(err.message)}))
        }
    })
    app.post('/starknet/cairo_version', async (req: Request, res: Response) => {
        console.log('/starknet/cairo_version')
        try {

            const pub =  req.body.pub
            const {provider} = new StarkNetProvider(req.body.chainRPC, req.body.proxy)
            const v = await getCairoVersion(pub, provider)

            res.statusCode = 200
            res.send(JSON.stringify({v: v}))
        } catch (err: any) {
            console.error(err)
            res.statusCode = 500
            res.send(JSON.stringify({error: JSON.stringify(err.message)}))
        }
    })
}

const getBase = (req: Request): Base => {
    return {
        proxy: req.body.proxy, //+
        pk: req.body.privateKey, //+
        account: req.body.account, //+
        estimateOnly: req.body.estimateOnly, //+
        rpc: req.body.chainRPC,//+
        maxFee: req.body.maxFee, //+
    }
}

type Base = {
    proxy?: string
    pk: string
    account:AccountType
    estimateOnly: boolean
    rpc: string
    maxFee?: string
}

export const genMnemonic = (): string =>{
    return  bip39.generateMnemonic(WORDLIST);
};


const getPrivateKeyFromMnemonicUrgentX = (source: string): string => {
    const mnemonic = Mnemonic.fromPhrase(source)
    const signer = HDNodeWallet.fromMnemonic(mnemonic)
    const masterNode = HDNodeWallet.fromSeed(signer.privateKey)
    const childNode = masterNode.derivePath(`m/44'/9004'/0'/0/0`)
    return '0x' + mStark.grindKey(childNode.privateKey).toString()
};

export const  getPrivateKeyFromMnemonicBraaaaaavaaaaaasStarkNet = (mnemonic: string): string =>{
    const seed: Uint8Array = bip39.mnemonicToSeedSync(mnemonic);
    const hdKey = bip32.HDKey.fromMasterSeed(seed);
    const path = "m/44'/9004'/0'/0/0";
    console.log("path =", path);
    const hdKeyDerived = hdKey.derive(path);
    if (!hdKeyDerived.privateKey) { throw new Error("bo privKey") }

    return "0x" + mStark.grindKey(hdKeyDerived.privateKey)
};


const resolveAccount = async (accType: AccountType, pk: string, provider: StarkNetProvider,) => {

    let account: StarkNetAccount
    switch (accType) {
        case AccountType.Braavos:{
            account =  new BraavosAccount(provider, pk)
            const v = await getCairoVersion(account.pub, account.provider)
            try {
                await account.nonce()
            } catch (e) {
                if (e.message.indexOf('Contract not found') === -1) {
                    account = new UrgentAccount(provider, pk, '1')
                }
            }
            break
        }
        case AccountType.UrgentX: {
            account = new UrgentAccount(provider, pk, '0')
            const v = await getCairoVersion(account.pub, account.provider)
            try {
                await account.nonce()
            } catch (e) {
               if (e.message.indexOf('Contract not found') === -1) {
                   account = new UrgentAccount(provider, pk, '1')
                }
            }
            break
        }

        default:
            throw new Error(`invalid account type: ${accType}`)
    }
    return account
}