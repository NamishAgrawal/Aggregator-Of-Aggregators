import {
    _constructor as odos_qote
} from './quotes/odos_qote.js';
import {
    _constructor as _0xswap_soft_quote
} from './quotes/_0xswap_soft_quote.js';
import {
    getQuote as openocean_quote
} from './quotes/OpenOcean.js';
import {
    _constructor as _1inch_quote
} from './quotes/1inch_quote.js';
import {
    _constructor as paraswap_quote
} from './quotes/paraswap_quote.js';

let odos = -1, _0xswap = -1, openocean = -1, _1inch = -1, paraswap = -1;
let pathId;
//fill in the gas price and slippage percentage

async function getQuote(inputAddress, amount, outputAddress, chainId, wallet_address, inputDecimals, outputDecimals,gasPrice) {
    console.log(`the input address is ${inputAddress}, the amount is ${amount}, the output address is ${outputAddress}, the chain id is ${chainId}, the wallet address is ${wallet_address}`)
    console.log(inputAddress, amount, outputAddress, chainId, wallet_address)
    try {
        const quote_odos = await odos_qote(chainId, 0.3, 0, true, inputAddress, outputAddress, amount.toString(), wallet_address);//42161, 0.3, 0, true, "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4", "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8", "1000000000000000000", "0x0a1c4d82a73f32023d527b3bc779f5d0f0715f05
        // let quote_odos = await odos_qote("42161", "0.3", "0", true, "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4", "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8", "1000000000000000000", "0x0a1c4d82a73f32023d527b3bc779f5d0f0715f05")
        console.log("in the GETQUOTE odos",quote_odos);
        odos = quote_odos.outAmounts[0];
        pathId = quote_odos.pathId;
    } catch (error) {
        console.error("Error:", error);
    }
    try {
        const quote_0xswap = await _0xswap_soft_quote(inputAddress, outputAddress, amount, chainId, wallet_address, 0.3) //sellToken, buyToken, sellAmount, chainId,takerAddress,slippagePercentage
        console.log(quote_0xswap);
        _0xswap = quote_0xswap.buyAmount;
        console.log("\n", _0xswap)
    } catch (error) {
        console.error("Error:", error);
    }
    try {
        const quote_openocean = await openocean_quote(chainId, inputAddress, outputAddress, amount / (10 ** inputDecimals), 1.0);//chain, inTokenAddress, outTokenAddress, amount, slippage, gasPrice
        console.log(quote_openocean);
        openocean = quote_openocean.data.outAmount;
    } catch (error) {
        console.error("Error: in open ocean", error);
    }
    try {
        // const quote_1inch = await _1inch_quote(inputAddress, outputAddress, amount, chainId);//src, dst, amount, chainId
        // console.log(quote_1inch);
        // _1inch = quote_1inch.toAmount;
    } catch (error) {
        console.error("Error:", error);
    }
    try {
        const quote_paraswap = await paraswap_quote(inputAddress, inputDecimals, outputAddress, outputDecimals, amount, "SELL", chainId);//_srcToken, _srcDecimals, _destToken, _destDecimals, _amount, _side, _network
        console.log(quote_paraswap);
        paraswap = quote_paraswap.priceRoute.destAmount;
    } catch (error) {
        console.error("Error:", error);
    }

    console.log(`odos: ${odos}, 0xswap: ${_0xswap}, openocean: ${openocean}, 1inch: ${_1inch}, paraswap: ${paraswap}`);
    let data = {
        odos: odos,
        _0xswap: _0xswap,
        openocean: openocean,
        _1inch: _1inch,
        paraswap: paraswap,
        odos_pathId: pathId,
    }
    return data;
}


export {
    getQuote
}