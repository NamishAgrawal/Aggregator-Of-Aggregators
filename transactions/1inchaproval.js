import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();
import {setTimeout} from 'timers/promises';

async function _constructor(chainId, tokenAddress, walletAddress, amount) {
    try {
        const responseData = await check_allowance(chainId, tokenAddress, walletAddress);
        console.log(responseData);
        const allowance = responseData.allowance;
        console.log(allowance);
        if ( allowance< amount) {
            await setTimeout(1000)
            const calldata = await generateAproval(chainId, tokenAddress, amount);
            console.log(calldata);
            return calldata;
        }
        else {
            return 0;
        }
    } catch (error) {
        console.error("Error:", error);
    }
}
// _constructor(42161, "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4", "0xdd2a4dbf3fdc4ae3b34a11797f51350a4306f1bb", "1000000000000000000");
async function check_allowance(chainId, _tokenAddress, _walletAddress) {

    const url = `https://api.1inch.dev/swap/v6.0/${chainId}/approve/allowance`;

    const config = {
        headers: {
            "Authorization": process.env._1INCH_API_KEY
        },
        params: {
            "tokenAddress": _tokenAddress,
            "walletAddress": _walletAddress
        }
    };


    try {
        const response = await axios.get(url, config);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}


async function generateAproval(chainId, _tokenAddress, _amount) {

    const url = `https://api.1inch.dev/swap/v6.0/${chainId}/approve/transaction`;

    const config = {
        headers: {
            "Authorization": process.env._1INCH_API_KEY
        },
        params: {
            "tokenAddress": _tokenAddress,
            "amount": _amount,
        }
    };


    try {
        const response = await axios.get(url, config);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export{
    _constructor
}