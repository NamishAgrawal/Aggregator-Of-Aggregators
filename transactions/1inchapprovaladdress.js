import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();
import { setTimeout } from 'timers/promises';

async function httpCall(chainId) {

    const url = `https://api.1inch.dev/swap/v6.0/${chainId}/approve/spender`;

    const config = {
        headers: {
            "Authorization": process.env._1INCH_API_KEY
        },
        params: {}
    };


    try {
        const response = await axios.get(url, config);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
export {
    httpCall
}