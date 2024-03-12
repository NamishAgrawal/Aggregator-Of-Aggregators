let wallet_address = null;
let srcDecimals = null;
let destDecimals = null;
let provider = null;
let account = null;

const abi = [
    // Read-Only Functions
    "function balanceOf(address owner) view returns (uint256)",
    "function decimals() view returns (uint8)",
    "function symbol() view returns (string)",

    // Authenticated Functions
    "function transfer(address to, uint amount) returns (bool)",

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
    const inputAddress = document.getElementById("inputAddress").value;
    const amount = document.getElementById("amount").value;
    const outputAddress = document.getElementById("outputAddress").value;
    const chainId = document.getElementById("chainId").value;

    const erc20_inp = new ethers.Contract(inputAddress, abi, provider);
    const erc20_out = new ethers.Contract(outputAddress, abi, provider);
    const inputDecimals = await erc20_inp.decimals();
    const outputDecimals = await erc20_out.decimals();
    if(inputDecimals == null ){
        console.log("Invalid Input Address");
        return;
    }
    else if(outputDecimals == null){
        console.log("Invalid Output Address");
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
    }).then(res => res.json()).then(data => {
        console.log(data);
    })


}


// module.exports = {
//     connectWallet,
//     printTransactionDetails,
// }