import axios from 'axios';

const baseUrl = process.env.REACT_APP_BACKEND_URL;

const jsonHeaders = {
    headers: {
        'Content-Type': 'application/json'
    }
};

const getMichalBNBBalancePLN = () => {
    return axios.get(`${baseUrl}/wallet/bnb/pln`).then((response) => response.data);
}

const getBinanceBalanceUSD = () => {
    return axios.get(`${baseUrl}/binance-card-balance/`).then((response) => response.data);
}

const sendMoneyToBinance = () => {
    return axios.put(`${baseUrl}/send-money-to-binance/`);
}

const everydayRefill = () => {
    return axios.put(`${baseUrl}/everyday-refill/`).then((response) => response.data);
}

const apiService = {
    getMichalBNBBalancePLN,
    getBinanceBalanceUSD,
    sendMoneyToBinance,
    everydayRefill
};

export default apiService;