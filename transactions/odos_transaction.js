import {
    _constructor
} from '../quotes/odos_qote.js';


async function makeTransaction(_chainId, _slippage, _referral_code, _compact, _input_address, _output_address, _input_amount, _user_address) {

    const quote = await _constructor(_chainId, _slippage, _referral_code, _compact, _input_address, _output_address, _input_amount, _user_address)
    const address = _user_address;
    const pathId = quote.pathId;
    console.log(pathId);

    const transactionUrl = "https://api.odos.xyz/sor/assemble";
    const transactionRequestBody = {
        "pathId": pathId,
        "simulate": false,
        "userAddr": address
    };
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
        console.log('Transaction:', transaction);
        return transaction;
        // handle transaction response data
    } else {
        console.error('Error in Transaction:', response);
        return;
        // handle transaction failure cases
    }
}
makeTransaction(42161, 0.3, 0, true, "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4", "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8", "1000000000000000000", "0xdd2a4dbf3fdc4ae3b34a11797f51350a4306f1bb");
export{
    makeTransaction
}