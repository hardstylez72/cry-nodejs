import {Express, Request, Response} from "express";
import {estimateSwapReq, getSwapData} from "./joe";

export const registerTraderJoeEndpoints = (app: Express) => {
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
}