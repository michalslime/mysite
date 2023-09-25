import React, { useEffect, useState } from 'react';
import binanceService from '../services/api-service';
import utils from '../services/utils';

function RefillComponent() {
    const [balancePLN, setBalancePLN] = useState(0);
    const [michalBNBBalancePLN, setMichalBNBBalancePLN] = useState(0);
    const [everydayRefillText, setEverydayRefillText] = useState('Uzupełnienie codzienne');

    useEffect(() => {
        binanceService.getBinanceBalanceUSD().then((balance) => {
            setBalancePLN(utils.formatMoney(balance.balancePLN));
        });

        binanceService.getMichalBNBBalancePLN().then((balance) => {
            setMichalBNBBalancePLN(utils.formatMoney(balance));
        });
    });

    const everydayRefill = () => {
        binanceService.everydayRefill().catch(err => {
            const message = utils.extractErrorMessage(err);
            setEverydayRefillText(message);
        });
    }

    return (
        <>
            <div className='card'>Binance Credid card: {balancePLN} PLN</div>
            <div className='card'>MichalBNB: {michalBNBBalancePLN} PLN</div>
            <div className='card' onClick={() => everydayRefill()}>{everydayRefillText}</div>
        </>
    )
}

export default RefillComponent;