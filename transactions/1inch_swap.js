import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();


async function _constructor(chainId, src, dst, amount, walletAddress, slippage) {
    try {
        const response = await httpCall(src, dst, amount, chainId, walletAddress, slippage);
        const tx = response.tx;
        console.log(tx);
        return await tx;
    }
    catch (error) {
        console.error("Error:", error);
    }
}
_constructor(42161, "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4", "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8", "1000000000000000000", "0xdd2a4dbf3fdc4ae3b34a11797f51350a4306f1bb", 3);
async function httpCall(_src, _dst, _amount, _chainId, _walletAddress, _slippage) {

    const url = `https://api.1inch.dev/swap/v6.0/${_chainId}/swap`;

    const config = {
        headers: {
            "Authorization": process.env._1INCH_API_KEY
        },
        params: {
            "src": _src,
            "dst": _dst,
            "amount": _amount,
            "from": _walletAddress,
            "slippage": _slippage
        }
    };


    try {
        const response = await axios.get(url, config);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

export{
    _constructor
}