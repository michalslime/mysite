const axios = require('axios');
const { Spot } = require('@binance/connector');

// TODO: move it to env variables
const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SERVICE;

const getBNBBalance = () => {
    return new Promise((resolve, reject) => {
        const client = new Spot(apiKey, apiSecret)

        client.userAsset({
            asset: "BNB"
        }).then(result => {
            let balance = 0;

            if (result && result.data && result.data[0]) {
                balance = result.data[0].free;
            }
            getBNBPrice().then((price) => {
                getUSDPLN().then((usdPLNPrice) => {
                    console.log('Currently USDPLN ex rate: ' + usdPLNPrice)
                    resolve({ balance, balanceUSD: balance * price, balancePLN: balance * price * usdPLNPrice});
                }).catch(() => {
                    reject("Unable to retrive USDPLN price");
                })
            }).catch(() => {
                reject("Unable to retrive BNB price");
            })
        }).catch((e) => {
            console.log(e);
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

const getUSDPLN = () => {
    return new Promise((resolve, reject) => {
        resolve(4.04); // USDPLN is generally around 4 zł, this should be updated if price goes below 4 permamently
    });
}

const binanceService = {
    getBNBBalance,
    getBNBPrice,
    getUSDPLN
};

module.exports = binanceService;