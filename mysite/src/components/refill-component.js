import React, { useEffect, useState } from 'react';
import binanceService from '../services/api-service';
import utils from '../services/utils';

function RefillComponent() {
    const [balancePLN, setBalancePLN] = useState(0);
    const [michalBNBBalancePLN, setMichalBNBBalancePLN] = useState(0);

    useEffect(() => {
        binanceService.getBinanceBalanceUSD().then((balance) => {
            setBalancePLN(utils.formatMoney(balance.balancePLN));
        });

        binanceService.getMichalBNBBalancePLN().then((balance) => {
            setMichalBNBBalancePLN(utils.formatMoney(balance));
        });
    });

    return (
        <>
            <div className='card'>Binance Credid card: {balancePLN} PLN</div>
            <div className='card'>MichalBNB: {michalBNBBalancePLN} PLN</div>
        </>
    )
}

export default RefillComponent;