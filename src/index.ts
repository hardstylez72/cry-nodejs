import express, {  Request, Response } from 'express'
import * as dotenv from 'dotenv';
import bodyParser from 'body-parser'
import { estimateSwapReq, getSwapData } from './joe'
import {getUrgentPub, UrgentAccount} from './startknet/account/urgent'
import { StarkNetProvider} from "./startknet/provider";
import {Approver} from "./startknet/erc20/approver";
import {Swapper} from "./startknet/swap/swapper";


dotenv.config();

let app =  express();
const port = process.env.PORT;
app.use(bodyParser());
app.use(bodyParser.urlencoded({
  extended: true
}));

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
    }

    const {provider} = new StarkNetProvider(Req.rpc,  Req.proxy)
    const account = new UrgentAccount(provider, Req.privateKey)
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
      platform: req.body.platform
    }

    const {provider} = new StarkNetProvider(Req.rpc,  Req.proxy)
    const account = new UrgentAccount(provider, Req.privateKey)
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
    }

    const {provider} = new StarkNetProvider(Req.rpc,  Req.proxy)
    const client = new UrgentAccount(provider, Req.privateKey)

     const data = await client.IsAccountDeployed()

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
    }
    const data = getUrgentPub(Req.privateKey)
    res.statusCode = 200
    res.send(JSON.stringify({publicKey: data}))
  } catch (e) {
    console.error(e)
    res.statusCode = 500
    res.send(JSON.stringify({error: JSON.stringify(e)}))
  }
})
app.post('/starknet/deploy_account', async (req: Request, res: Response) => {
  console.log('/starknet/deploy_account')
  try {

    const Req = {
      proxy: req.body.proxy,
      rpc: req.body.chainRPC,
      estimateOnly: req.body.estimateOnly,
      privateKey: req.body.privateKey,
    }

    const {provider} = new StarkNetProvider(Req.rpc, Req.proxy)
    const client = new UrgentAccount(provider, Req.privateKey)

    let data: any
    if (Req.estimateOnly) {
      data = await client.DeployAccountEstimate()
    } else {
      data = await client.DeployAccount()
    }

    res.statusCode = 200
    res.send(JSON.stringify(data))
  } catch (e) {
    console.error(e)
    res.statusCode = 500
    res.send(JSON.stringify({error: JSON.stringify(e)}))
  }
})
app.post('/joe/swap-data', async (req: Request, res: Response) => {
  console.log('/joe/swap-data')

  try {
    const p: estimateSwapReq = {
      amount: req.body.amount,
      chainRPC: req.body.chainRPC,
      fromToken: req.body.fromToken,
      toToken: req.body.toToken,
      recipient: req.body.recipient
    }
    const data = await getSwapData(p)
    res.statusCode = 200
    res.send(JSON.stringify(data))
  } catch (e) {
    console.error(e)
    res.statusCode = 500
    res.send(JSON.stringify({error: JSON.stringify(e)}))
  }
});

app.on('uncaughtException', parent => {
  console.error(parent)
})
app.on('error', parent => {
  console.error(parent)
})
app.on('listen', parent => {
  console.log(parent)
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});



