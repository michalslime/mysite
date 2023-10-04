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
const oneHour = 3600000;
const oneMonth = 31 * twentyFourHours;
const everydayRefillAmount = 100;
const minimumRefillAmount = 20;
const urgentRefillAmount = 10;
let urgentRefills = [];
let urgentRefillTimeoutId;

const checkAndRefillBinanceAccount = () => {
    setInterval(async () => {
        if (lastRefill + twentyFourHours < Date.now()) {
            binanceService.getBNBBalance().then((balance) => {

                if (balance.balancePLN < refillAmountHigher) {
                    if (balance.balancePLN > refillAmountLower) {
                        walletService.sendMoneyToBinance(refillAmountLower).then(async () => {
                            await emailService.sendSuccessEmailAsync(refillAmountLower, balance.balancePLN);
                            lastRefill = Date.now();
                        }).catch(async (e) => {
                            if (lastErrorMessageUnableToSendMoney + twelveHours < Date.now()) {
                                await emailService.sendErrorEmail('Unable to send money to Binance')
                                lastErrorMessageUnableToSendMoney = Date.now();
                            }
                        });
                    } else if (balance.balancePLN < refillAmountLower) {
                        walletService.sendMoneyToBinance(refillAmountHigher).then(async () => {
                            await emailService.sendSuccessEmailAsync(refillAmountHigher, balance.balancePLN);
                            lastRefill = Date.now();
                        }).catch(async (e) => {
                            if (lastErrorMessageUnableToSendMoney + twelveHours < Date.now()) {
                                await emailService.sendErrorEmailAsync('Unable to send money to Binance')
                                lastErrorMessageUnableToSendMoney = Date.now();
                            }
                        });
                    }
                } else {
                    console.log('Binance credit card has enough money');
                }
            }).catch(async (e) => {
                if (lastErrorMessageUnableToRetriveBNBBalance + twelveHours < Date.now()) {
                    await emailService.sendErrorEmailAsync('Unable to retrieve BNB balance');
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
            return;
        } else {
            reject({
                code: 403,
                message: 'You have enough money'
            });
            return;
        }
    });
}

const urgentRefill = () => {
    return new Promise(async (resolve, reject) => {
        if (refillService.urgentRefillStarted) {
            reject({
                code: 403,
                message: 'You already started urgent refill'
            });

            return;
        }

        refillService.urgentRefillStarted = true;

        const timestampNow = Date.now();

        urgentRefills = urgentRefills.filter(x => timestampNow - oneMonth < x);

        if (urgentRefills.length > 1) {
            const nextPossibleUrgentRefillDate = new Date(urgentRefills[0] + oneMonth);
            reject({
                code: 403,
                message: 'You already used urgent refills twice in past 31 days, next possible urgent refill date: ' + nextPossibleUrgentRefillDate.toLocaleDateString()
            });
            return;
        }

        const walletBalance = await walletService.getBNBBalance();

        if (walletBalance < urgentRefillAmount) {
            reject({
                code: 403,
                message: 'You have not enough money on Wallet'
            });
            return;
        }

        console.log('Preparing timeout...');
        urgentRefillTimeoutId = setTimeout(async () => {
            urgentRefills.push(timestampNow);
            urgentRefillTimeoutId = undefined;
            refillService.urgentRefillStarted = false;
            await walletService.sendMoneyToBinance(urgentRefillAmount);
        }, twentySeconds); // MSTODO: change to 15 minutes

        resolve();
        return;
    });
}

const cancelUrgentRefill = () => {
    return new Promise(async (resolve, reject) => {
        if (urgentRefillTimeoutId === undefined) {
            reject({
                code: 403,
                message: 'There is no urgent refill in progress'
            });
            return;
        }

        clearTimeout(urgentRefillTimeoutId);
        urgentRefillTimeoutId = undefined;
        refillService.urgentRefillStarted = false;

        resolve();
    });
}

const urgentRefillInProgress = () => {
    return urgentRefillTimeoutId !== undefined;
}

const refillService = {
    checkAndRefillBinanceAccount,
    everydayRefill,
    urgentRefill,
    urgentRefillInProgress,
    cancelUrgentRefill
};

module.exports = refillService;