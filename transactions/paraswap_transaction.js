import {
    _constructor
} from "../quotes/paraswap_quote.js";

    const quote = await _constructor("0xf97f4df75117a78c1A5a0DBb814Af92458539FB4", 18, "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8", 6, "1000000000000000000", "SELL", 42161);
    console.log("test");
    // console.log(quote);

console.log(quote);
async function makeTransaction(_srcToken, _srcDecimals, _destToken, _destDecimals, _amount, _chainId) {}
// const Route = quote.priceRoute;

// const baseUrl = `/transactions/${chainId}`;
// const _destamount = quote.priceRoute.destAmount;


// const transactionRequestBody = {
//     priceRoute: Route,
//     srcToken:_srcToken,
//     srcDecimals:_srcDecimals,
//     destToken: _destToken,
//     destDecimals:_destDecimals,
//     srcAmount: _amount,
//     destAmount:_destamount
// };

export{
    makeTransaction
}