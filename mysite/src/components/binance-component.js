import React, {  } from 'react';
import { useNavigate } from "react-router-dom";

let counter = 0;

function BinanceComponent() {
    const navigate = useNavigate();

    return (
        <>
            <div className='card' onClick={() => navigate('/refill')}>Binance card refill</div>
            <div className='card' onClick={() => navigate('/cryptocom/refill')}>CryptoCom card refill</div>
        </>
    )
}

export default BinanceComponent;