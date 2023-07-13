const emailService = require('./email-service');
const binanceService = require('./binance-service');
const walletService = require('./wallet-service');

let lastErrorMessageUnableToSendMoney = 0;
let lastErrorMessageUnableToRetriveBNBBalance = 0;
let lastAccountInfo = 0;
let lastRefill = 0;
const refillAmountHigher = 12; // 50
const refillAmountLower = 6; // 25
const twentyFourHours = 24 * 3600000;
const twentyThreeHours = 23 * 3600000;
const twelveHours = 12 * 3600000;
const twentySeconds = 20000;
const twentyMinutes = 1200000;

const checkAndRefillBinanceAccount = () => {
    setInterval(() => {
        if (lastRefill + twentyFourHours < Date.now()) {
            binanceService.getBNBBalance().then((balance) => {

                let day = new Date();
                if (lastAccountInfo + twentyThreeHours < Date.now() && day.getHours() === 7) {
                    emailService.sendBalanceEmail(balance.balanceUSD);
                    lastAccountInfo = Date.now();
                }

                if (balance.balanceUSD < refillAmountHigher) {
                    if (balance.balanceUSD > refillAmountLower) {
                        walletService.sendMoneyToBinance(refillAmountLower).then(() => {
                            emailService.sendSuccessEmail(refillAmountLower, balance.balanceUSD);
                            lastRefill = Date.now();
                        }).catch((e) => {
                            if (lastErrorMessageUnableToSendMoney + twelveHours < Date.now()) {
                                emailService.sendErrorEmail('Unable to send money to Binance')
                                lastErrorMessageUnableToSendMoney = Date.now();
                            }
                        });
                    } else if (balance.balanceUSD < refillAmountLower) {
                        walletService.sendMoneyToBinance(refillAmountHigher).then(() => {
                            emailService.sendSuccessEmail(refillAmountHigher, balance.balanceUSD);
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
            }).catch((e) =>{
                if (lastErrorMessageUnableToRetriveBNBBalance + twelveHours < Date.now()) {
                    emailService.sendErrorEmail('Unable to retrieve BNB balance');
                    lastErrorMessageUnableToRetriveBNBBalance = Date.now();
                }
            });
        }
    }, twentySeconds);
}

const refillService = {
    checkAndRefillBinanceAccount
};

module.exports = refillService;