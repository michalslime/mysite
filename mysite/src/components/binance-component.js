import React, { useEffect, useState, useRef } from 'react';
import binanceService from '../services/api-service';
import utils from '../services/utils';
import { Link, useNavigate } from "react-router-dom";
import QrReader from 'react-qr-scanner';
import QRCode from "react-qr-code";

let counter = 0;

const previewStyle = {
    height: 240,
    width: 320,
}

function BinanceComponent() {
    const [balancePLN, setBalancePLN] = useState(0);
    const navigate = useNavigate();
    const videoEl = useRef(null);
    const [state, setState] = useState({
        delay: 100,
        result: 'No result'
    });

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

    const handleScan = (data) => {
        console.log(data);
        setState({
            result: data,
        })
    }

    const handleError = (err) => {
        console.error(err)
    }

    return (
        <>
            <QrReader
                delay={state.delay}
                style={previewStyle}
                onError={handleError}
                onScan={handleScan}
            />
            { state && state.result && <QRCode
                size={256}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={state.result.text}
                viewBox={`0 0 256 256`}
            /> }
            <p>{state && state.result && state.result.text}</p>
        </>
    )
}

export default BinanceComponent;