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
    const tenTo18 = FixedNumber.fromString('1000000000000000000');
    const amountWeiFN = FixedNumber.fromString(amountWei);
    const amountCrypto = amountWeiFN.divUnsafe(tenTo18);
    
    return amountCrypto * exchangeRate;
}


const calculator = {
    calculateX,
    calculateAmountUsd
};

module.exports = calculator;