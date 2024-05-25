
async function _constructor(chainId, inTokenAddress, outTokenAddress, amount, slippage, gasPrice,account) {
    const chain = getChainCode(chainId);
    const baseUrl = `https://open-api.openocean.finance/v3/${chain}/swap_quote`;
    const params = {
        inTokenAddress,
        outTokenAddress,
        amount, //without decimals
        slippage,
        gasPrice,
        account,
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
        console.log("Quote:", data);
    } else {
        console.error("Error:", data.error || response.statusText);
    }
}

// Example usage:


// const inTokenAddress = '0xf97f4df75117a78c1A5a0DBb814Af92458539FB4';
// const outTokenAddress = '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8';
// const amount = "1";
// const slippage = "0.5";
// const gasPrice = "0.1";
// const chain = 42161;
// const account = "0xdd2a4dbf3fdc4ae3b34a11797f51350a4306f1bb";

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



_constructor(chain, inTokenAddress, outTokenAddress, amount, slippage, gasPrice,account);

export{
    _constructor
}