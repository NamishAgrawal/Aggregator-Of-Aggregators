import dotenv from 'dotenv';
dotenv.config();


let baseUrl = 'https://api.0x.org/swap/v1/price';

async function _constructor(sellToken, buyToken, sellAmount, chainId, takerAddress, slippagePercentage) {
    setBaseurl(chainId);
    return await start(sellToken, buyToken, sellAmount, takerAddress, slippagePercentage);
}


function setBaseurl(chainId) {
    if (chainId == 1) {
        baseUrl = 'https://api.0x.org/swap/v1/price'; //mainnet
    } else if (chainId == 56) {
        baseUrl = '	https://bsc.api.0x.org/swap/v1/price'; //bsc
    } else if (chainId == 137) {
        baseUrl = 'https://polygon.api.0x.org/swap/v1/price';//polygon
    } else if (chainId == 10) {
        baseUrl = 'https://optimism.api.0x.org/swap/v1/price';//optimism
    }
    else if (chainId == 42161) {
        baseUrl = 'https://arbitrum.api.0x.org/swap/v1/price';//arbitrum
    }
}


async function start(_sellToken, _buyToken, _sellAmount, _takerAddress, _slippagePercentage) {
    const params = {
        sellToken: _sellToken,
        buyToken: _buyToken,
        sellAmount: _sellAmount,
        takerAddress: _takerAddress,
        slippagePercentage: _slippagePercentage
    };


    const url = new URL(baseUrl);
    url.searchParams.append('sellToken', params.sellToken);
    url.searchParams.append('buyToken', params.buyToken);
    url.searchParams.append('sellAmount', params.sellAmount);

    const apiKey = process.env._0xSWAP_API_KEY; // Replace with your actual API key

    // fetch(url, {
    //     method: 'GET',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         '0x-api-key': apiKey,
    //     },
    // })
    //     .then(response => response.json())
    //     .then(data => {
    //         console.log('0xswap Quote:', data);
    //         console.log(`Buy Amount: ${data.buyAmount}`);
    //         return  data;
    //     })
    //     .catch(error => {
    //         console.error('Error fetching quote:', error);
    //         return
    //     });
    // }
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            '0x-api-key': apiKey,
        },
    });
    const data = await response.json();
    console.log('0xswap Quote:', data);
    console.log(`Buy Amount: ${data.buyAmount}`);
    return data;
 }

//function call

// async function main() { // Use an async function for top-level execution
//     const quotee = await _constructor('0xf97f4df75117a78c1A5a0DBb814Af92458539FB4', '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8', '1000000000000000000', 42161);
//     console.log(quotee);
// }

// main();
export {
    _constructor
}