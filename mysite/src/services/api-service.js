import axios from 'axios';

const baseUrl = process.env.REACT_APP_BACKEND_URL;

const jsonHeaders = {
    headers: {
        'Content-Type': 'application/json'
    }
};

const getFrugalMATICBalancePLN = () => {
    return axios.get(`${baseUrl}/wallet/matic/pln`).then((response) => response.data);
}

const getMichalBNBBalancePLN = () => {
    return axios.get(`${baseUrl}/wallet/bnb/pln`).then((response) => response.data);
}

const getBinanceBalanceUSD = () => {
    return axios.get(`${baseUrl}/binance-card-balance/`).then((response) => response.data);
}

const getTimeouts = () => {
    return axios.get(`${baseUrl}/timeouts/`).then((response) => response.data);
}

const sendMoneyToBinance = () => {
    return axios.put(`${baseUrl}/send-money-to-binance/`);
}

const everydayRefill = () => {
    return axios.put(`${baseUrl}/everyday-refill/`).then((response) => response.data);
}

const everydayRefillMatic = () => {
    return axios.put(`${baseUrl}/everyday-refill/matic`).then((response) => response.data);
}

const urgentRefill = () => {
    return axios.put(`${baseUrl}/urgent-refill/`).then((response) => response.data);
}

const cancelUrgentRefill = () => {
    return axios.delete(`${baseUrl}/urgent-refill/`).then((response) => response.data);
}

const apiService = {
    getMichalBNBBalancePLN,
    getBinanceBalanceUSD,
    sendMoneyToBinance,
    everydayRefill,
    urgentRefill,
    getTimeouts,
    cancelUrgentRefill,
    getFrugalMATICBalancePLN,
    everydayRefillMatic
};

export default apiService;