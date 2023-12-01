const { ethers, FixedNumber } = require("ethers");

const calculateX = async (amountUSD, amountWei, exchangeRate) => {
    const tenTo18 = FixedNumber.fromString('1000000000000000000');
    const amountWeiFN = FixedNumber.fromString(amountWei);
    const amountCrypto = amountWei.divUnsafe(tenTo18);

    throw new Error('not implemented');
    // exchangeRate = amountUSD / amountWei

    // const xxx = FixedNumber.fromValue(receipt.gasUsed * receipt.gasPrice);
    // 
    // console.log('xxx: ' + xxx.toString());
    // const transactionFee = xxx.div(big);
}

const calculateAmountUsd = (amountWei, exchangeRate) => {
    const tenTo5 = FixedNumber.fromString('100000');
    const tenTo18 = FixedNumber.fromString('1000000000000000000');
    console.log(amountWei);
    let amountWeiFN;
    let amountCrypto;

    if (amountWei.length > 10) {
        const amountWeiDiv10000 = amountWei.substring(0, amountWei.length - 5); // stupid workaround for "overflow" error
        amountWeiFN = FixedNumber.fromString(amountWeiDiv10000);
        const x = amountWeiFN.divUnsafe(tenTo18);
        amountCrypto = x.mulUnsafe(tenTo5);
    } else {
        amountWeiFN = FixedNumber.fromString(amountWei);
        amountCrypto = amountWeiFN.divUnsafe(tenTo18);
    }

    return amountCrypto * exchangeRate;
}


const calculator = {
    calculateX,
    calculateAmountUsd
};

module.exports = calculator;