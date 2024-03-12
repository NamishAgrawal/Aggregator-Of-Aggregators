import axios from "axios";
import dotenv from 'dotenv';
dotenv.config();

let _src,_dst,_amount,_chainId;

async function _constructor(src, dst, amount, chainId){
  _src = src;
  _dst = dst;
  _amount = amount;
  _chainId = chainId;
  return await httpCall();
}

async function httpCall() {

  const url = `https://api.1inch.dev/swap/v5.2/${_chainId}/quote`;

  const config = {
      headers: {
  "Authorization": process.env._1INCH_API_KEY
},
      params: {
  "src": _src,
  "dst": _dst,
  "amount": _amount,
  "fee": "0",
  "includeTokensInfo": "false",
  "includeGas": "true"
}
  };
      

  try {
    const response = await axios.get(url, config);
    console.log(response.data);
    console.log("the output amount is :", response.data.toAmount);
    return await response.data;
  } catch (error) {
    console.error(error);
    return;
  }
}
// _constructor("0xf97f4df75117a78c1A5a0DBb814Af92458539FB4", "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8", "1000000000000000000", 42161)
export{
  _constructor
}