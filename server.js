
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

import{
    makeTransaction as paraswap_t
} from "./transactions/paraswap_transaction.js"

import{
    _constructor as get1inchapproval
}from "./transactions/1inchaproval.js"

import{
    _constructor as _1inch_t
} from "./transactions/1inch_swap.js"
import{
    httpCall as _1inchapprovaladdress
} from "./transactions/1inchapprovaladdress.js"
let pathId;
let paraswap_priceRoute;
let inputDecimals;
let outputDecimals;

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
    inputDecimals = req.body.inputDecimals
    outputDecimals = req.body.outputDecimals
    let gasPrice = req.body.gasPrice
    let quotes = null;
    try {
        quotes = await getQuote(inputAddress, amount * (10 ** inputDecimals), outputAddress, chainId, wallet_address, inputDecimals, outputDecimals,gasPrice)
        if (quotes) {
            console.log("in server", quotes)
            pathId = quotes.odos_pathId;
            paraswap_priceRoute = quotes.paraswap_priceRoute;
            console.log("\n\npathId", pathId,'\n\n')
            console.log("\n\nparaswap_priceRoute", paraswap_priceRoute,'\n\n')
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

app.post('/getParaswap', async (req, res) =>{
    console.log("server paraswap transaction body",req.body);
    (async () => {
        try{
            //(_srcToken, _destToken, _srcamount, wallet_address,_priceRoute,_network)
            // inputAddress: inputAddress,
            // outputAddress: outputAddress,
            // amount: amount,
            // wallet_address: wallet_address,
            // chainId: chainId, 
            console.log("params:",req.body.inputAddress, req.body.outputAddress, req.body.amount, req.body.wallet_address, paraswap_priceRoute, req.body.chainId)
            let data = await paraswap_t(req.body.inputAddress, req.body.outputAddress, req.body.amount, req.body.wallet_address, paraswap_priceRoute, req.body.chainId);
            if(data){
                console.log("server side paraswap data works:")
                console.log(data)
                res.json(data);
            }
            else{
                res.status(500).json({ error: "Something went wrong" });
            }
        }
        catch(error){
            console.log("error",error);
            res.status(500).json({ error: "Something went wrong" });
        }
    })();
})

app.post('/get1inchapproval',async (req,res)=>{
    (async () => {
        try{
            let data = await _1inchapprovaladdress(req.body.chainId);
            if(data){
                console.log("server side 1inch approval data works:")
                console.log(data)
                res.json(data);
            }
            else{
                res.status(500).json({ error: "Something went wrong" });
            }
        }
        catch(error){
            console.log("error",error);
            res.status(500).json({ error: "Something went wrong" });
        }
    })();
})

app.post('/get1inch', async (req,res)=>{
    (async()=>{
        try{
            // (chainId, src, dst, amount, walletAddress, slippage
            console.log("params for 1inch:",req.body.chainId, req.body.inputAddress, req.body.outputAddress, req.body.amount, req.body.wallet_address, 3)
            let data = await _1inch_t(req.body.chainId, req.body.inputAddress, req.body.outputAddress, req.body.amount, req.body.wallet_address, 3);
            if(data){
                console.log("server side 1inch data works:")
                console.log(data)
                res.json(data);
            }
            else{
                res.status(500).json({ error: "Something went wrong" });
            }
        }
        catch(error){
            console.log("error",error);
            res.status(500).json({ error: "Something went wrong" });
        }
    })();
})

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})