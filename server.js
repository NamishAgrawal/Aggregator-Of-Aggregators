
import express from 'express'

import {
    getQuote
} from './GETQUOTE.js';

import{
    _constructor as _0x_t
} from './transactions/_0xswap_transaction.js'
import{
    makeTransaction as odos_t
}from './transactions/odos_tr2.js'

import{
    _constructor as openocean_t
} from "./transactions/OpenOcean_transaction.js"

let pathId;

const app = express()

app.use(express.json())
app.use(express.static('public'))

app.post('/getInfo', async (req, res) => {
    console.log(req.body)
    let inputAddress = req.body.inputAddress
    let amount = req.body.amount
    let outputAddress = req.body.outputAddress
    let chainId = req.body.chainId
    let wallet_address = req.body.wallet_address
    let inputDecimals = req.body.inputDecimals
    let outputDecimals = req.body.outputDecimals
    let gasPrice = req.body.gasPrice
    let quotes = null;
    try {
        quotes = await getQuote(inputAddress, amount * (10 ** inputDecimals), outputAddress, chainId, wallet_address, inputDecimals, outputDecimals,gasPrice)
        if (quotes) {
            console.log("in server", quotes)
            pathId = quotes.odos_pathId;
            console.log("\n\npathId", pathId,'\n\n')
            res.json(quotes);
        } else {
            res.status(500).json({ error: "Something went wrong" });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Something went wrong" });
    }

})

app.post('/get0xt', async (req, res) => {

    let inputAddress = req.body.inputAddress
    let amount = req.body.amount
    let outputAddress = req.body.outputAddress
    let chainId = req.body.chainId
    let wallet_address = req.body.wallet_address
    let inputDecimals = req.body.inputDecimals
    let outputDecimals = req.body.outputDecimals
    let quotes = null;
    (async () => {
        try {
            console.log(inputAddress, outputAddress, amount * (10 ** inputDecimals), chainId, wallet_address,0.03);
            quotes = await _0x_t(inputAddress, outputAddress, amount * (10 ** inputDecimals), chainId, wallet_address,0.03);
            const _0xtdata ={
                gasLimit: quotes.gas,
                gasPrice: quotes.gasPrice,
                to: quotes.to,
                data: quotes.data,
                value: quotes.value,
                chainId: quotes.chainId,
                approval_address: quotes.allowanceTarget,
            }
            if(quotes){
                console.log("server side 0xt data works:")
                console.log(quotes)
            res.json(quotes);
            }
            else{
                res.status(500).json({ error: "Something went wrong" });
            }
        
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Something went wrong" });
        }
    })();
})  

app.post('/getOdos', async (req, res) =>{
    let address = req.body.wallet_address;
    let assembled = null;
    (async () => {
        try {
            console.log(pathId, address);
            assembled = await odos_t(pathId, address);
            if(assembled){
                console.log("server side odos data works:")
                console.log(assembled)
                res.json(assembled);
            }
            else{
                res.status(500).json({ error: "Something went wrong" });
            }
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Something went wrong" });
        }
    })();
});


app.post('/getOpenOcean', async (req, res) =>{
    //chainId, inTokenAddress, outTokenAddress, amount, slippage, gasPrice,account
    console.log(req.body)
    let account = req.body.account;
    let chainId = req.body.chainId;
    let inTokenAddress = req.body.inTokenAddress;
    let outTokenAddress = req.body.outTokenAddress;
    let amount = req.body.amount;
    let slippage = req.body.slippage;
    let gasPrice = req.body.gasPrice;
    console.log("account", account, "chainId", chainId, "inTokenAddress", inTokenAddress, "outTokenAddress", outTokenAddress, "amount", amount, "slippage", slippage, "gasPrice", gasPrice);
    (async () => {
        try {
            let data = await openocean_t(chainId,inTokenAddress, outTokenAddress, amount, slippage, gasPrice, account);
            if(data){
                console.log("server side openocean data works:")
                console.log(data)
                res.json(data);
            }
            else{
                res.status(500).json({ error: "Something went wrong" });
            }
        } catch (error) {
            console.error("Error:", error);
            res.status(500).json({ error: "Something went wrong" });
        }
    })();
});



app.listen(3000, () => {
    console.log("Server is running on port 3000")
})