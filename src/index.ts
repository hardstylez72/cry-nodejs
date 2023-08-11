
import express, {  Request, Response } from 'express'
import * as dotenv from 'dotenv';
import bodyParser from 'body-parser'
import { estimateSwapReq, getSwapData } from './joe'
import { Client } from './starknet'



const client = new Client({})
client.toString()

dotenv.config();

let app =  express();
const port = process.env.PORT;
app.use(bodyParser());
app.use(bodyParser.urlencoded({
  extended: true
}));



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



