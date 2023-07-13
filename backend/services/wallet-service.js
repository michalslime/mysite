const { ethers, FixedNumber } = require("ethers");
const binanceService = require('../services/binance-service');

const sendMoneyToBinance = async (amountUSD) => {
    return new Promise(async (resolve, reject) => {
        const price = await binanceService.getBNBPrice();

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
                console.log('Sending...');
                return tx.wait()
            })
            .then((receipt) => {
                resolve();
            })
            .catch(() => reject('Something rong'));


    })
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
    sendMoneyToBinance
};

module.exports = walletService;