const formatMoney = (value) => {
    const parsedValue = parseFloat(value);
    const toReturn = parsedValue.toLocaleString('pl-PL', {maximumFractionDigits:2});
    return toReturn
}
const utils = {
    formatMoney
};

export default utils;