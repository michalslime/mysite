const emailService = require('./email-service');
const binanceService = require('./binance-service');
const walletService = require('./wallet-service');

let lastErrorMessageUnableToSendMoney = 0;
let lastErrorMessageUnableToRetriveBNBBalance = 0;
let lastAccountInfo = 0;
let lastRefill = 0;
let lastEverydayRefillDay = 0;
const refillAmountHigher = 200;
const refillAmountLower = 100;
const twentyFourHours = 24 * 3600000;
const twentyThreeHours = 23 * 3600000;
const twelveHours = 12 * 3600000;
const twentySeconds = 20000;
const twentyMinutes = 1200000;
const everydayRefillAmount = 100;
const minimumRefillAmount = 20;

const checkAndRefillBinanceAccount = () => {
    setInterval(async () => {
        if (lastRefill + twentyFourHours < Date.now()) {
            binanceService.getBNBBalance().then((balance) => {

                if (balance.balancePLN < refillAmountHigher) {
                    if (balance.balancePLN > refillAmountLower) {
                        walletService.sendMoneyToBinance(refillAmountLower).then(() => {
                            emailService.sendSuccessEmail(refillAmountLower, balance.balancePLN);
                            lastRefill = Date.now();
                        }).catch((e) => {
                            if (lastErrorMessageUnableToSendMoney + twelveHours < Date.now()) {
                                emailService.sendErrorEmail('Unable to send money to Binance')
                                lastErrorMessageUnableToSendMoney = Date.now();
                            }
                        });
                    } else if (balance.balancePLN < refillAmountLower) {
                        walletService.sendMoneyToBinance(refillAmountHigher).then(() => {
                            emailService.sendSuccessEmail(refillAmountHigher, balance.balancePLN);
                            lastRefill = Date.now();
                        }).catch((e) => {
                            if (lastErrorMessageUnableToSendMoney + twelveHours < Date.now()) {
                                emailService.sendErrorEmail('Unable to send money to Binance')
                                lastErrorMessageUnableToSendMoney = Date.now();
                            }
                        });
                    }
                } else {
                    console.log('Binance credit card has enough money');
                }
            }).catch((e) => {
                if (lastErrorMessageUnableToRetriveBNBBalance + twelveHours < Date.now()) {
                    emailService.sendErrorEmail('Unable to retrieve BNB balance');
                    lastErrorMessageUnableToRetriveBNBBalance = Date.now();
                }
            });
        }

        let day = new Date();
        if (lastAccountInfo + twentyThreeHours < Date.now() && day.getHours() === 7) {
            binanceService.getBNBBalance().then(async (balance) => {
                await emailService.sendBalanceEmailAsync(balance.balancePLN);
                lastAccountInfo = Date.now();
            });
        }
    }, twentySeconds);
}

const everydayRefill = async () => {
    return new Promise(async (resolve, reject) => {
        const date = new Date();

        const day = date.getDate();

        if (day === lastEverydayRefillDay) {
            reject({
                code: 403,
                message: 'You already refilled today'
            });
        }

        const balance = await binanceService.getBNBBalance();

        if (balance.balancePLN < everydayRefillAmount) {
            const diff = everydayRefillAmount - balance.balancePLN;
            const refillAmount = diff < minimumRefillAmount ? minimumRefillAmount : diff;

            await walletService.sendMoneyToBinance(refillAmount);

            lastEverydayRefillDay = day;

            resolve();
        } else {
            reject({
                code: 403,
                message: 'You have enough money'
            });
        }
    });
}

const refillService = {
    checkAndRefillBinanceAccount,
    everydayRefill
};

module.exports = refillService;