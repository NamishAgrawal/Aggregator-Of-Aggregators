async function makeTransaction(pathId,address){
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

export{
    makeTransaction
}