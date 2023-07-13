import React, { useEffect, useState } from 'react';
import binanceService from '../services/api-service';

function BinanceComponent() {
    const [balanceUSD, setBalanceUSD] = useState(0);

    useEffect(() => {
        binanceService.getBinanceBalanceUSD().then((balance) => {
            setBalanceUSD(balance);
        })
        
    });

    return (
        <div onClick={() => binanceService.sendMoneyToBinance()}>{balanceUSD}</div>
    )
}

export default BinanceComponent;