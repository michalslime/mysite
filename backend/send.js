const { ethers, FixedNumber } = require("ethers");
const axios = require('axios');
const { Spot } = require('@binance/connector')

// TODO: move it to env variables
const apiKey = 'HtMLlQyvHDHl6y2xy9HHN9a0weQqdc3lK9619405MjZl7mNZo7BalnlLpOgqUsaD';
const apiSecret = 'NC9gKJTKZSAOtcjzHgmof2frED0n1ay440BLduMsxXMNxjy9G27xLNEcB9OiDWg2';

async function checkAndRefill() {
    console.log('Checking current balance...');

    getBalanceBNB().then((balanceUSD) => {
        var sendFunc;

        if (balanceUSD > 25) {
            console.log("Money level is enough");
        } else if (balanceUSD > 12) {
            sendFunc = send.bind(this, 13);
        } else {
            sendFunc = send.bind(this, 25);
        }

        sendFunc().then(() => {
            console.log('hura');
        }).catch((error) => console.error('Sending money failed'));
    })
}


async function getBalanceBNB() {
    return new Promise((resolve, reject) => {
        const client = new Spot(apiKey, apiSecret)

        client.userAsset({
            asset: "BNB"
        }).then(result => {
            if (!(result && result.data && result.data[0])) {
                reject("Unable to retrive data");
            } else {
                const balance = result.data[0].free;

                getBNBPrice().then((price) => {
                    resolve(balance * price);
                });
            }
        })
    });
}

async function getBNBPrice() {
    return new Promise((resolve, reject) => {
        axios.get(`https://www.binance.com/api/v3/ticker/price?symbol=BNBUSDT`).then((response) => {
            resolve(response.data.price);
        });
    });
}

async function printBalance() {
    // Configuring the connection to an Ethereum node
    const provider = new ethers.JsonRpcProvider("https://bsc-dataseed.binance.org");

    const balance = await provider.getBalance("0x495d2de278ab086d4331e0bfde6e8e487aebca34");

    const xxx = FixedNumber.fromValue(balance);
    const big = FixedNumber.fromString('1000000000000000000');

    const balanceBNB = xxx.div(big);

    getBNBPrice().then((price) => {
        console.log('Balance in USD: ' + balanceBNB * price);
        console.log('Balance in PLN: ' + balanceBNB * price * 4);
    });
}

// USD
async function send(amount) {
    console.log("Sending money...");

    const price = await getBNBPrice();
    console.log(price);

    const bnb = amount / price;
    console.log(bnb);

    const valueWei = ethers.parseUnits(bnb.toString(), "ether");
    console.log(valueWei);

    // Configuring the connection to an Ethereum node
    const provider = new ethers.JsonRpcProvider("https://bsc-dataseed.binance.org");

    // Creating a signing account from a private key
    // SIGNER_PRIVATE_KEY = BNB on Chrome Lime
    const signer = new ethers.Wallet(process.env.SIGNER_PRIVATE_KEY, provider);

    const binanceBNBWallet = '0x495d2de278ab086d4331e0bfde6e8e487aebca34';
    const cryptoComBNBWallet = '0x371c63161FE7FB12F8f66458371E256EE3F607aA';

    // Creating and sending the transaction object
    const tx = await signer.sendTransaction({
        to: cryptoComBNBWallet,
        value: valueWei
    });
    console.log("Mining transaction...");
    // Waiting for the transaction to be mined
    const receipt = await tx.wait();
    // The transaction is now on chain!
    console.log(receipt);
    const xxx = FixedNumber.fromValue(receipt.gasUsed * receipt.gasPrice);
    const big = FixedNumber.fromString('1000000000000000000');
    console.log('xxx: ' + xxx.toString());
    const transactionFee = xxx.div(big);
    console.log('Fee: ' + transactionFee.toString());
    console.log(`Mined in block ${receipt.blockNumber}`);
}

require("dotenv").config();

// checkAndRefill();

send(100).then(() => {
    console.log('hura');
}).catch((error) => console.error('Sending money failed'));