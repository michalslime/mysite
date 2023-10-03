import React, { useEffect, useState } from 'react';
import binanceService from '../services/api-service';
import utils from '../services/utils';

function BinanceComponent() {
    const [balancePLN, setBalancePLN] = useState(0);

    useEffect(() => {
        binanceService.getBinanceBalanceUSD().then((balance) => {
            setBalancePLN(utils.formatMoney(balance.balancePLN));
        });
    });

    return (
        <>
            <div className='card'>Binance card: {balancePLN} PLN</div>
        </>
    )
}

export default BinanceComponent;