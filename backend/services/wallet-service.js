const { ethers, FixedNumber } = require("ethers");
const binanceService = require('../services/binance-service');
const calculator = require('../utils/calculator');

const sendMoneyToBinance = async (amountPLN) => {
    return new Promise(async (resolve, reject) => {
        const price = await binanceService.getBNBPrice();

        const usdPLNPrice = await binanceService.getUSDPLN();
        const amountUSD = amountPLN / usdPLNPrice;

        const bnb = amountUSD / price;

        const valueWei = ethers.parseUnits(bnb.toString(), "ether");

        // Configuring the connection to an Ethereum node
        const provider = new ethers.JsonRpcProvider("https://bsc-dataseed.binance.org");

        // Creating a signing account from a private key
        // SIGNER_PRIVATE_KEY = BNB on Chrome Lime
        const signer = new ethers.Wallet(process.env.SIGNER_PRIVATE_KEY, provider);

        signer.sendTransaction({
            to: "0x495d2de278ab086d4331e0bfde6e8e487aebca34", // binance address
            value: valueWei
        })
            .then(tx => {
                console.log(`${valueWei}, ${amountPLN} PLN sending...`);
                return tx.wait()
            })
            .then((receipt) => {
                console.log('Sent!');
                resolve();
            })
            .catch((e) => {
                console.error(e);
                reject('Something wrong')
            });
    })
}

const getBNBBalance = async () => {
    const provider = new ethers.JsonRpcProvider("https://bsc-dataseed.binance.org");

    const balance = await provider.getBalance("0x045Ab0dff3A51f17588fceb5dAcE31beF1Ff3a00");

    const exchangeRate = await binanceService.getBNBPrice();

    console.log(exchangeRate);

    const balanceUsd = calculator.calculateAmountUsd(balance.toString(), exchangeRate)

    const usdPLNPrice = await binanceService.getUSDPLN();

    return (balanceUsd * usdPLNPrice).toString();
}

const sendMoneyToCryptoCom = async (amountPLN) => {
    return new Promise(async (resolve, reject) => {
        const price = 0.76;

        const usdPLNPrice = await binanceService.getUSDPLN();
        const amountUSD = amountPLN / usdPLNPrice;

        const matic = amountUSD / price;

        const valueWei = ethers.parseUnits(matic.toString(), "ether");

        // Configuring the connection to an Ethereum node
        const provider = new ethers.JsonRpcProvider("https://polygon-mainnet.infura.io/v3/0217b384eae940609e9751c2bff6bcc0");

        // Creating a signing account from a private key
        // SIGNER_PRIVATE_KEY = Frugal on Ubuntu
        const signer = new ethers.Wallet(process.env.SIGNER_PRIVATE_KEY, provider);

        const transactionData = {
            to: "0x371c63161FE7FB12F8f66458371E256EE3F607aA", // crypto com polygon address
            value: valueWei,
            gasLimit: 0
        };

        signer.estimateGas(transactionData).then((estimatedGasLimit) => {
            transactionData.gasLimit = estimatedGasLimit;

            signer.sendTransaction(transactionData).then(tx => {
                console.log(`Transaction id: ${tx.hash}, ${valueWei} WEI, ${amountPLN} PLN sending...`);
                return tx.wait();
            }).then((receipt) => {
                    console.log('Sent!');
                    resolve();
                })
                .catch((e) => {
                    console.error(e);
                    reject('Something wrong')
                });
        }).catch((error) => {
            console.error('Error estimating gas limit:', error);
        });
    })
}

const getMATICBalance = async () => {
    const provider = new ethers.JsonRpcProvider("https://rpc-mainnet.maticvigil.com/");

    const balance = await provider.getBalance("0xb8dfD79f5c99ffA3Cb4B25Bcb2Aee102A79c179f");

    const exchangeRate = 0.76; // MATIC to USD

    const balanceUsd = calculator.calculateAmountUsd(balance.toString(), exchangeRate)

    const usdPLNPrice = await binanceService.getUSDPLN();

    return (balanceUsd * usdPLNPrice).toString();
}

const calculateGas = (receipt) => {
    // console.log(receipt);
    // const xxx = FixedNumber.fromValue(receipt.gasUsed * receipt.gasPrice);
    // const big = FixedNumber.fromString('1000000000000000000');
    // console.log('xxx: ' + xxx.toString());
    // const transactionFee = xxx.div(big);
    // console.log('Fee: ' + transactionFee.toString());
    // console.log(`Mined in block ${receipt.blockNumber}`);
}

const walletService = {
    sendMoneyToBinance,
    getBNBBalance,
    getMATICBalance,
    sendMoneyToCryptoCom
};

module.exports = walletService;