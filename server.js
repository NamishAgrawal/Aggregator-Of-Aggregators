// const express = require('express')
import express from 'express'
// import {
//     _constructor as odos_qote
// } from './quotes/odos_qote.js';
// import {
//     _constructor as _0xswap_soft_quote
// } from './quotes/_0xswap_soft_quote.js';
// import {
//     getQuote as openocean_quote
// } from './quotes/OpenOcean.js';
// import {
//     _constructor as _1inch_quote
// } from './quotes/1inch_quote.js';
// import {
//     _constructor as paraswap_quote
// } from './quotes/paraswap_quote.js';

import {
    getQuote
} from './GETQUOTE.js';

import{
    _constructor as _0x_t
} from './transactions/_0xswap_transaction.js'

// import {
//     _constructor as _0x_t
// } from './quotes/temp.js';


const app = express()

// app.set('view engine', 'ejs');

// app.get("/",(req,res)=>{
//     console.log("Hello World")  
//     res.render('index')
// })

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
    let quotes = null;
    try {
        quotes = await getQuote(inputAddress, amount * (10 ** inputDecimals), outputAddress, chainId, wallet_address, inputDecimals, outputDecimals)
        if (quotes) {
            console.log("in server", quotes)
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
                console.log("im workinggggggg!!!!!")
                // console.log(_0xtdata)
            res.json(_0xtdata);
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



app.listen(3000, () => {
    console.log("Server is running on port 3000")
})