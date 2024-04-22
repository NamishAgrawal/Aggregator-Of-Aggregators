// import { ethers } from "ethers";

let wallet_address = null;
let srcDecimals = null;
let destDecimals = null;
let provider = null;
let account = null;
let odosQuote;
let _0xswapQuote;
let openoceanQuote;
let _1inchQuote;
let paraswapQuote;
let bestQuote;

let inputAddress;
let amount;
let outputAddress;
let chailet;
let erc20_inp;
let erc20_out;
let inputDecimals;
let outputDecimals;


const abi = [
    // Read-Only Functions
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",
    "function allowance(address owner, address spender) view returns (uint256)",
    // Authenticated Functions
    "function transfer(address to, uint amount) returns (bool)",
    "function approve(address spender, uint256 amount) returns (bool)",

    // Events
    "event Transfer(address indexed from, address indexed to, uint amount)"
];

async function connectWallet() {
    if (window.ethereum) {
        provider = new ethers.providers.Web3Provider(window.ethereum)
        account = await provider.send("eth_requestAccounts", []);
        console.log(account[0]);
        wallet_address = account[0];
        console.log("Connected to wallet");
    }
    else {
        console.log("Please install MetaMask");
    }
}

async function printTransactionDetails() {
    if (wallet_address == null) {
        console.log("Please connect to wallet first");
        return;
    }
    inputAddress = document.getElementById("inputAddress").value;
    amount = document.getElementById("amount").value;
    outputAddress = document.getElementById("outputAddress").value;
    chainId = document.getElementById("chainId").value;
    erc20_inp = new ethers.Contract(inputAddress, abi, provider);
    erc20_out = new ethers.Contract(outputAddress, abi, provider);
    inputDecimals = await erc20_inp.decimals();
    outputDecimals = await erc20_out.decimals();
    if (inputDecimals == null) {
        console.log("Invalid Input Address");
        return;
    }
    else if (outputDecimals == null) {
        console.log("Invalid Output Address");
        return;
    }
    else if (inputAddress == undefined || amount == undefined || outputAddress == undefined || chainId == undefined) {
        console.log("please enter all the values");
        return;
    }
    console.log("Wallet Address:", wallet_address);
    console.log("Input Decimals:", inputDecimals);
    console.log("Output Decimals:", outputDecimals);
    console.log("Input Address:", inputAddress);
    console.log("Amount:", amount);
    console.log("Output Address:", outputAddress);
    console.log("Chain ID:", chainId);

    fetch('/getInfo', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            inputAddress: inputAddress,
            amount: amount,
            outputAddress: outputAddress,
            chainId: chainId,
            wallet_address: wallet_address,
            inputDecimals: inputDecimals,
            outputDecimals: outputDecimals
        })
    })
        .then(res => res.json())
        .then(data => {
            console.log("in script.js ", data);
            document.getElementById("qquote").innerHTML = data;
            const odosQuote = data.odos == -1 ? -1 : data.odos;
            const _0xswapQuote = data._0xswap == -1 ? -1 : data._0xswap;
            const openoceanQuote = data.openocean == -1 ? -1 : data.openocean;
            const _1inchQuote = data._1inch == -1 ? -1 : data._1inch;
            const paraswapQuote = data.paraswap == -1 ? -1 : data.paraswap;

            console.log("ODOS Quote:", odosQuote);
            console.log("0xSwap Quote:", _0xswapQuote);
            console.log("OpenOcean Quote:", openoceanQuote);
            console.log("1inch Quote:", _1inchQuote);
            console.log("Paraswap Quote:", paraswapQuote);
            document.getElementById("0x_q").innerHTML = _0xswapQuote;
            document.getElementById("1inch_q").innerHTML = _1inchQuote;
            document.getElementById("odos_q").innerHTML = odosQuote;
            document.getElementById("openocean_q").innerHTML = openoceanQuote;
            document.getElementById("paraswap_q").innerHTML = paraswapQuote;
            bestQuote = Math.max(odosQuote, _0xswapQuote, openoceanQuote, _1inchQuote, paraswapQuote);
            console.log("Best Quote:", bestQuote);
            document.getElementById("best_q").innerHTML = bestQuote;
        })
}


async function checkAllowance(tokenAddress, spenderAddress, ownerAddress) {
    try {
        if (!provider) {
            console.error("Provider not initialized. Please connect to a node first.");
            return null;
        }

        const token = new ethers.Contract(tokenAddress, abi, provider);
        console.log("Token:", token); 

        const allowance = await token.allowance(ownerAddress, spenderAddress);
        console.log("Allowance:", allowance);

        return allowance;
    } catch (error) {
        console.error("Error checking allowance:", error);
        return null; 
    }
}


async function setAllowance(tokenAddress, spenderAddress, amount) {
    try {
        const token = new ethers.Contract(tokenAddress, abi, provider);
        const signer = provider.getSigner();
        const allowanceAmount = ethers.utils.parseUnits(amount.toString(), 18);
        const tx = await token.connect(signer).approve(spenderAddress, allowanceAmount);
        await tx.wait();
        console.log("Approval Successful for", allowanceAmount.toString(), "tokens");
    } catch (error) {
        console.error("Error setting approval:", error);
    }
}




async function _0x_t() {
    if (wallet_address == null) {
        console.log("Please connect to wallet first");
        return;
    }
    if (_0xswapQuote == "Not Available") {
        console.log("Not Available");
        return;
    }
    fetch('/get0xt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            inputAddress: inputAddress,
            amount: amount,
            outputAddress: outputAddress,
            chainId: chainId,
            wallet_address: wallet_address,
            inputDecimals: inputDecimals,
            outputDecimals: outputDecimals
        })
    })
        .then(res => res.json())
        .then(data => {
            console.log("im got the data, ", data);
            console.log("approval address", data.approval_address);
            const approval_address = data.approval_address;
            checkAllowance(inputAddress, approval_address, wallet_address)
            .then(allowance => {
            const approval = ethers.utils.parseUnits(allowance.toString(), inputDecimals);
            console.log("amount = ",amount);
            console.log("approval = ",approval.toString());
            if (approval.lt(ethers.utils.parseUnits(amount, inputDecimals))) {
                console.log("Approval Required");
                setAllowance(inputAddress, approval_address, amount);
            }
            else{
                console.log("Approval Not Required");
            }
        })
    })
}

// module.exports = {
//     connectWallet,
//     printTransactionDetails,
// }