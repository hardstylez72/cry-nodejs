import express from 'express'
import * as dotenv from 'dotenv';
import bodyParser from 'body-parser'
import {registerStarkNetEndpoints} from "./startknet/endpoints";
import {registerTraderJoeEndpoints} from "./traderjoe/endpoints";

dotenv.config();


let app =  express();
const port = process.env.PORT;
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

registerStarkNetEndpoints(app)
registerTraderJoeEndpoints(app)
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



