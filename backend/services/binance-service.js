const axios = require('axios');
const { Spot } = require('@binance/connector');

// TODO: move it to env variables
const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SERVICE;

const getBNBBalance = () => {
    return new Promise((resolve, reject) => {
        const client = new Spot(apiKey, apiSecret)

        console.log('Retrieving BNB balance...');
        client.userAsset({
            asset: "BNB"
        }).then(result => {
            let balance = 0;

            if (result && result.data && result.data[0]) {
                balance = result.data[0].free;
            }

            console.log('Balance: ' + balance);

            console.log('Retrieving BNB price...');
            getBNBPrice().then((price) => {
                console.log('Price: ' + price);
                resolve({ balance, balanceUSD: balance * price });
            }).catch(() => {
                reject("Unable to retrive BNB price");
            })
        }).catch((e) => {
            reject("Unable to retrive BNB balance");
        })
    });
}

const getBNBPrice = () => {
    return new Promise((resolve, reject) => {
        axios.get(`https://www.binance.com/api/v3/ticker/price?symbol=BNBUSDT`).then((response) => {
            resolve(response.data.price);
        });
    });
}

const binanceService = {
    getBNBBalance,
    getBNBPrice
};

module.exports = binanceService;