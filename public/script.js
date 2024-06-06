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
let feeData; 
let bestRoute;
let gasPrice = 2;
// let pathId;

let inputAddress;
let amount;
let outputAddress;
let chailet;
let erc20_inp;
let erc20_out;
let inputDecimals;
let outputDecimals;
let chainId;

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
    outputDecimals = await erc20_out.decimals()

    // gasPrice = (await provider.getFeeData()).maxFeePerGas

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
            outputDecimals: outputDecimals,
            gasPrice: gasPrice
        })
    })
        .then(res => res.json())
        .then(data => {
            console.log("in script.js ", data);
            document.getElementById("qquote").innerHTML = data;
            const odosQuote = data.odos == -1 ? -1 : data.odos/(10 ** outputDecimals);
            const _0xswapQuote = data._0xswap == -1 ? -1 : data._0xswap/(10 ** outputDecimals);
            const openoceanQuote = data.openocean == -1 ? -1 : data.openocean/(10 ** outputDecimals);
            const _1inchQuote = data._1inch == -1 ? -1 : data._1inch/(10 ** outputDecimals);
            const paraswapQuote = data.paraswap == -1 ? -1 : data.paraswap/(10 ** outputDecimals);

            // if(odosQuote != -1){
            // pathId = odosQuote.pathId;
            // }

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
            switch(bestQuote){
                case odosQuote:
                    document.getElementById("best_q").innerHTML = "ODOS: "+bestQuote;
                    console.log("best route is odos!")
                    bestRoute = "ODOS";
                    break;
                case _0xswapQuote:
                    document.getElementById("best_q").innerHTML = "0xSwap: "+bestQuote;
                    bestRoute = "0xSwap";
                    break;
                case openoceanQuote:
                    document.getElementById("best_q").innerHTML = "OpenOcean: "+bestQuote;
                    bestRoute = "OpenOcean";
                    break;
                case _1inchQuote:
                    document.getElementById("best_q").innerHTML = "1inch: "+bestQuote;
                    bestRoute = "1inch";
                    break;
                case paraswapQuote:
                    document.getElementById("best_q").innerHTML = "Paraswap: "+bestQuote;
                    bestRoute = "Paraswap";
                    break;
            }
            // document.getElementById("best_q").innerHTML = bestQuote;
        })
}
async function getbest(){
    switch(bestRoute){
        case "ODOS":
            odos_t();
            break;
        case "0xSwap":
            _0x_t();
            break;
        case "OpenOcean":
            openocean_t();
            break;
        case "1inch":
            _1inch_t();
            break;
        case "Paraswap":
            paraswap_t();
            break;
    }
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




// async function _0x_t() {
//     if (wallet_address == null) {
//         console.log("Please connect to wallet first");
//         return;
//     }
//     if (_0xswapQuote == "Not Available") {
//         console.log("Not Available");
//         return;
//     }
//     fetch('/get0xt', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Accept': 'application/json'
//         },
//         body: JSON.stringify({
//             inputAddress: inputAddress,
//             amount: amount,
//             outputAddress: outputAddress,
//             chainId: chainId,
//             wallet_address: wallet_address,
//             inputDecimals: inputDecimals,
//             outputDecimals: outputDecimals
//         })
//     })
//         .then(res => res.json())
//         .then(data => {
//             console.log("im got the data, ", data);
//             console.log("approval address", data.approval_address);
//             const approval_address = data.approval_address;
//             checkAllowance(inputAddress, approval_address, wallet_address)
//             .then(allowance => {
//             const approval = ethers.utils.parseUnits(allowance.toString(), inputDecimals);
//             console.log("amount = ",amount);
//             console.log("approval = ",approval.toString());
//             if (approval.lt(ethers.utils.parseUnits(amount, inputDecimals))) {
//                 console.log("Approval Required");
//                 setAllowance(inputAddress, approval_address, amount);
//             }
//             else{
//                 console.log("Approval Not Required");
//             }
//         })
//     })
// }


async function _0x_t() {
    const signer = provider.getSigner();
    if (wallet_address == null) {
        console.log("Please connect to wallet first");
        return;
    }
    if (_0xswapQuote == -1) {
        console.log("Not Available");
        return;
    }

    try {
        const response = await fetch('/get0xt', {
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
        });
        console.log("Response from server on calling /get0xt:");
        const data = await response.json();
        console.log("Got the data:", data);
        console.log("data.value before tx creation:", data.value);
        const allowance = await checkAllowance(inputAddress, data.allowanceTarget, wallet_address);
        const approval = ethers.utils.parseUnits(allowance.toString(), inputDecimals);
        console.log("amount = ", amount);
        console.log("approval = ", approval.toString());

        if (approval.lt(ethers.utils.parseUnits(amount, inputDecimals))) {
            console.log("Approval Required");
            await setAllowance(inputAddress, data.approval_address, amount); 
        }
        console.log("value:", data.value);

        // const tx = {
        //     to: data.to, // Address of the recipient (DEX contract)
        //     gasLimit: data.gasLimit, // Gas limit from swapQuoteJSON (optional, might need adjustment)
        //     data: data.data, // Additional data specific to the DEX or swap function
        // };
        let valueHex;
        if (data.value === "0") {
            valueHex = "0x0";
        } else {
            const valueBN = ethers.BigNumber.from(data.value);
            valueHex = ethers.utils.hexlify(valueBN);
        }
        const gasBN = ethers.BigNumber.from(data.gas);
        const gasHex = ethers.utils.hexlify(gasBN);
        const gasPBN = ethers.BigNumber.from(data.gasPrice);
        const gasPHex = ethers.utils.hexlify(gasPBN);
        const sentTx = await signer.sendTransaction({
            gasLimit: gasHex,
            gasPrice: gasPHex,
            to: data.to,
            data: data.data,
            value: valueHex,
            chainId: data.chainId,
        });
        console.log("Transaction sent! Hash:", sentTx.hash);

        // Optionally, wait for transaction confirmation
        const receipt = await sentTx.wait();
        console.log("Transaction confirmed! Block number:", receipt.blockNumber);
    } catch (error) {
        console.error("Error handling swap:", error);
        // Handle errors appropriately (e.g., display user-friendly message)
    }
}

async function odos_t() {
    const signer = provider.getSigner();
    if (wallet_address == null) {
        console.log("Please connect to wallet first");
        return;
    }
    if (odosQuote == -1) {
        console.log("Not Available");
        return;
    }
    try{
        const response = await fetch('/getOdos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                wallet_address: wallet_address,
            })
        });
        console.log("Response from server on calling /getOdos:");
        const data = await response.json();
        console.log("Got the data:", data);
        const allowance = await checkAllowance(inputAddress, data.transaction.to, wallet_address);
        const approval = ethers.utils.parseUnits(allowance.toString(), inputDecimals);
        console.log("amount = ", amount);
        console.log("approval = ", approval.toString());

        if (approval.lt(ethers.utils.parseUnits(amount, inputDecimals))) {
            console.log("Approval Required");
            await setAllowance(inputAddress, data.transaction.to, amount); 
        }   
        let valueHex;
        if (data.transaction.value === "0") {
            valueHex = "0x0";
        } else {
            const valueBN = ethers.BigNumber.from(data.transaction.value);
            valueHex = ethers.utils.hexlify(valueBN);
        }
        const gasBN = ethers.BigNumber.from(data.transaction.gas);
        const gasHex = ethers.utils.hexlify(gasBN);
        const gasPBN = ethers.BigNumber.from(data.transaction.gasPrice);
        const gasPHex = ethers.utils.hexlify(gasPBN);
        const sentTx = await signer.sendTransaction({
            gasLimit: gasHex,
            gasPrice: gasPHex,
            to: data.transaction.to,
            data: data.transaction.data,
            value: valueHex,
            chainId: data.transaction.chainId,
        });
        console.log("Transaction sent! Hash:", sentTx.hash);

        // Optionally, wait for transaction confirmation
        const receipt = await sentTx.wait();
        console.log("Transaction confirmed! Block number:", receipt.blockNumber);
    } catch (error) {
        console.error("Error handling swap:", error);
        // Handle errors appropriately (e.g., display user-friendly message)
    }
}

async function openocean_t(){
    const signer = provider.getSigner();
    if (wallet_address == null) {
        console.log("Please connect to wallet first");
        return;
    }
    try{
        const response = await fetch('/getOpenOcean', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({      //chainId, inTokenAddress, outTokenAddress, amount, slippage, gasPrice,account
                chainId: chainId,
                inTokenAddress: inputAddress,
                outTokenAddress: outputAddress,
                amount: amount,
                slippage: 0.5,
                gasPrice: 1,
                account: wallet_address
            })
        });
        console.log("Response from server on calling /getOpenOcean:");
        const data = await response.json();
        console.log("Got the data:", data);
        console.log("to:", data.data.to);
        const allowance = await checkAllowance(inputAddress, data.data.to, wallet_address);
        const approval = ethers.utils.parseUnits(allowance.toString(), inputDecimals);
        console.log("amount = ", amount);
        console.log("approval = ", approval.toString());

        if (approval.lt(ethers.utils.parseUnits(amount, inputDecimals))) {
            console.log("Approval Required");
            await setAllowance(inputAddress, data.data.to, amount); 
        }   
        let valueHex;
        if (data.data.value === "0") {
            valueHex = "0x0";
        } else {
            const valueBN = ethers.BigNumber.from(data.data.value);
            valueHex = ethers.utils.hexlify(valueBN);
        }
        const gasBN = ethers.BigNumber.from(data.data.estimatedGas);
        const gasHex = ethers.utils.hexlify(gasBN);
        // const gasPBN = ethers.BigNumber.from(data.transaction.gasPrice);
        // const gasPHex = ethers.utils.hexlify(gasPBN);
        const sentTx = await signer.sendTransaction({
            gasLimit: gasHex,
            // gasPrice: gasPHex,
            to: data.data.to,
            data: data.data.data,
            value: valueHex,
            // chainId: data.data.chainId
        });
        console.log("Transaction sent! Hash:", sentTx.hash);

        // Optionally, wait for transaction confirmation
        const receipt = await sentTx.wait();
        console.log("Transaction confirmed! Block number:", receipt.blockNumber);
    } catch (error) {
        console.error("Error handling swap:", error);
    }
}

async function paraswap_t(){
    const signer = provider.getSigner();
    if (wallet_address == null) {
        console.log("Please connect to wallet first");
        return;
    }
    if (paraswapQuote == -1) {
        console.log("Not Available");
        return;
    }
    try{
        const response = await fetch('/getParaswap',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                inputAddress: inputAddress,
                outputAddress: outputAddress,
                amount: amount,
                wallet_address: wallet_address,
                chainId: chainId, 
            })
        });
        console.log("Response from server on calling /getParaswap:");
        const data = await response.json();
        console.log("Got the data:", data);
    }catch(error){
        console.error("Error handling swap:", error);
    }
}

async function _1inch_t(){
    const signer = provider.getSigner();
    if (wallet_address == null) {
        console.log("Please connect to wallet first");
        return;
    }
    if (_1inchQuote == -1) {
        console.log("Not Available");
        return;
    }
    try{
        const response = await fetch('/get1inchapproval', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({      //chainId, inTokenAddress, outTokenAddress, amount, slippage, gasPrice,account
                chainId: chainId,
            })
        });
        console.log("Response from server on calling /get1inchapproval:");
        const data = await response.json();
        console.log("Got the data:", data);
        console.log("to:", data.address);
        const allowance = await checkAllowance(inputAddress, data.address, wallet_address);
        const approval = ethers.utils.parseUnits(allowance.toString(), inputDecimals);
        console.log("amount = ", amount);
        console.log("approval = ", approval.toString());
        if (approval.lt(ethers.utils.parseUnits(amount, inputDecimals))) {
            console.log("Approval Required");
            await setAllowance(inputAddress, data.address, amount); 
        }
    } catch (error) {
        console.error("Error handling swap:", error);
    }
    try{
        const response = await fetch('/get1inch',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body:{
                inputAddress: inputAddress,
                outputAddress: outputAddress,
                amount: amount,
                wallet_address: wallet_address,
                chainId: chainId
            }
        });
        const data1 = await response.json();
        console.log("Got the data:", data1);
        let valueHex;
        if (data1.value === "0") {
            valueHex = "0x0";
        } else {
            const valueBN = ethers.BigNumber.from(data1.value);
            valueHex = ethers.utils.hexlify(valueBN);
        }
        const gasBN = ethers.BigNumber.from(data1.gas);
        const gasPriceBN = ethers.BigNumber.from(data1.gasPrice);
        const sentTx = await signer.sendTransaction({
            gasLimit: gasBN,
            gasPrice: gasPriceBN,
            to: data1.to,
            data: data1.data,
            value: valueHex,
        });
        console.log("Transaction sent! Hash:", sentTx.hash);
        // Optionally, wait for transaction confirmation
        const receipt = await sentTx.wait();
        console.log("Transaction confirmed! Block number:", receipt.blockNumber);
    }
    catch(error){
        console.log("error",error);
    }
}
// module.exports = {
//     connectWallet,
//     printTransactionDetails,
// }