
import express, {  Request, Response } from 'express'
import * as dotenv from 'dotenv';
import bodyParser from 'body-parser'
import { estimateSwapReq, getSwapData } from './joe'
import {Client, MainNet} from './starknet'


dotenv.config();

let app =  express();
const port = process.env.PORT;
app.use(bodyParser());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.post('/starknet/is_account_deployed', async (req: Request, res: Response) => {
  console.log('/starknet/is_account_deployed')
  try {

    const Req = {
      proxy: req.body.proxy,
      rpc: req.body.chainRPC,
      privateKey: req.body.privateKey,
    }

    const client = new Client(Req.rpc, Req.proxy)

     const data = await client.IsAccountDeployed(Req.privateKey)

    res.statusCode = 200
    res.send(JSON.stringify({deployed: data}))
  } catch (e) {
    console.error(e)
    res.statusCode = 500
    res.send(JSON.stringify({error: JSON.stringify(e)}))
  }
})

const starknetClient = new Client(MainNet)
app.post('/starknet/account_pub', async (req: Request, res: Response) => {
  console.log('/starknet/account_pub')
  try {

    const Req = {
      privateKey: req.body.privateKey,
    }
    const data = starknetClient.GetDeployedPubKey(Req.privateKey)
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

    const client = new Client(Req.rpc, Req.proxy)

    let data: any
    if (Req.estimateOnly) {
      data = await client.DeployAccountEstimate(Req.privateKey)
    } else {
      data = await client.DeployAccount(Req.privateKey)
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



