import axios from 'axios';

const baseUrl = process.env.REACT_APP_BACKEND_URL;

const jsonHeaders = {
    headers: {
        'Content-Type': 'application/json'
    }
};

const getBinanceBalanceUSD = () => {
    return axios.get(`${baseUrl}/binance-card-balance/`).then((response) => response.data);
}

const sendMoneyToBinance = () => {
    return axios.put(`${baseUrl}/send-money-to-binance/`);
}

const apiService = {
    getBinanceBalanceUSD,
    sendMoneyToBinance
};

export default apiService;