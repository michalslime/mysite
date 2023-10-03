import React, { useEffect, useState } from 'react';
import binanceService from '../services/api-service';
import utils from '../services/utils';

function RefillComponent() {
    const [balancePLN, setBalancePLN] = useState(0);
    const [michalBNBBalancePLN, setMichalBNBBalancePLN] = useState(0);
    const [everydayRefillText, setEverydayRefillText] = useState('Uzupełnienie codzienne');
    const [classes, setClasses] = useState({
        everyday: ['card']
    });

    useEffect(() => {
        binanceService.getBinanceBalanceUSD().then((balance) => {
            setBalancePLN(utils.formatMoney(balance.balancePLN));
        });

        binanceService.getMichalBNBBalancePLN().then((balance) => {
            setMichalBNBBalancePLN(utils.formatMoney(balance));
        });
    });

    const everydayRefill = () => {
        binanceService.everydayRefill().then(() => {
            classes.everyday.push('success');
        }).catch(err => {
            const message = utils.extractErrorMessage(err);
            classes.everyday.push('error');
            setEverydayRefillText(message);
        });
    }

    const getClasses = (objName) => {
        return classes[objName].join(' ');
    }

    return (
        <>
            <div className='card'>Binance Credid card: {balancePLN} PLN</div>
            <div className='card'>MichalBNB: {michalBNBBalancePLN} PLN</div>
            <div className={getClasses('everyday')} onClick={() => everydayRefill()}>{everydayRefillText}</div>
        </>
    )
}

export default RefillComponent;