import React, { useEffect, useState } from 'react';
import binanceService from '../services/api-service';
import utils from '../services/utils';
import { Link, useNavigate } from "react-router-dom";

let counter = 0;

function BinanceComponent() {
    const [balancePLN, setBalancePLN] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        counter = 0;
        binanceService.getBinanceBalanceUSD().then((balance) => {
            setBalancePLN(utils.formatMoney(balance.balancePLN));
        });
    });

    const increaseCounter = () => {
        counter += 1;

        if (counter > 5) {
            navigate('/refill')
        }
    }

    return (
        <>
            <div className='card' onClick={() => increaseCounter()}>Binance card: {balancePLN} PLN</div>
        </>
    )
}

export default BinanceComponent;