import{_constructor as getQuote} from '../quotes/paraswap_quote.js';

let quotee = await getQuote("0xf97f4df75117a78c1A5a0DBb814Af92458539FB4", 18, "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8", 6, "1000000000000000000", "SELL", 42161);
let priceRoute = quotee.priceRoute;
    makeTransaction("0xf97f4df75117a78c1A5a0DBb814Af92458539FB4",18, "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",6, "1000000000000000000", "0xc0def418e6a13b78a5320b9c3331d2bf21add4f2", priceRoute, 42161);
async function makeTransaction(_srcToken,srcDecimals, _destToken,destDecimals, _srcamount, wallet_address,_priceRoute,_network) {
    // n _constructor(_srcToken, _srcDecimals, _destToken, _destDecimals, _amount, _side, _network)
    // console.log(`the input address is ${_srcToken}, the amount is ${_srcamount}, the output address is ${_destToken}, the chain id is ${_network}, the wallet address is ${wallet_address}`)
    const transactionUrl = `https://apiv5.paraswap.io/transactions/${_network}`;
    console.log("transactionUrl",transactionUrl);
    const transactionRequestBody = {
        "srcToken": _srcToken,
        "destToken": _destToken,
        "srcAmount": _srcamount,
        "priceRoute": _priceRoute,
        "userAddress": wallet_address,
        "srcDecimals": srcDecimals,
        "destDecimals": destDecimals
    };
    console.log("transactionRequestBody",transactionRequestBody);
    return await getTransaction(transactionRequestBody, transactionUrl);
}


async function getTransaction(transactionRequestBody, transactionUrl) {
    const response = await fetch(
        transactionUrl,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(transactionRequestBody),
        });

    if (response.status === 200) {  
        const transaction = await response.json();
        console.log('Transaction paraswap:', transaction);
        return transaction;
        // handle transaction response data
    } else {
        console.error('Error in Transaction:', response);
        return;
        // handle transaction failure cases
    }
}

export{
    makeTransaction
}