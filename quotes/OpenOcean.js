
async function getQuote(chainId, inTokenAddress, outTokenAddress, amount, slippage, gasPrice) {
    const chain = getChainCode(chainId);
    const baseUrl = `https://open-api.openocean.finance/v3/${chain}/quote`;

    const params = {
        inTokenAddress,
        outTokenAddress,
        amount, //without decimals
        slippage,
        gasPrice,
    };
    const url = new URL(baseUrl);
    url.search = new URLSearchParams(params);
    // console.log("params:", params);
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },
    });

    const data = await response.json();

    if (response.ok) {
        console.log("OpenOcean Quote:", data);
        console.log(`Buy Amount: ${data.data.outAmount}`);
        return data;
    } else {
        console.error("Error:", data.error || response.statusText);
        return;
    }
}

// Example usage:


// const inTokenAddress = '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4';
// const outTokenAddress = '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8';
// const amount = "1";
// const slippage = "0.5";
// const gasPrice = "0.1";
function getChainCode(chainId) {
    switch (chainId) {
        case 1:
            return 'eth';
        case 56:
            return 'bsc';
        case 137:
            return 'polygon';
        case 42161:
            return 'arbitrum';
        case 43114:
            return 'avax';
        case 10:
            return 'optimism';
        default:
            return 'ETH';
    }
}
// const chain = getChainCode(42161);


// getQuote(chain, inTokenAddress, outTokenAddress, amount, slippage, gasPrice);

export{
    getQuote
}