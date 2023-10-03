import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import binanceService from '../services/api-service';
import utils from '../services/utils';

const classes = {
    everyday: ['card'],
    urgentCheckbox: ['card'],
    urgent: ['card']
}

function RefillComponent() {
    const [balancePLN, setBalancePLN] = useState(0);
    const [michalBNBBalancePLN, setMichalBNBBalancePLN] = useState(0);
    const [everydayRefillText, setEverydayRefillText] = useState('Uzupełnienie codzienne');
    const [urgentCheckboxText, setUrgentCheckboxText] = useState('Awaryjnie potrzebuję kasy');
    const [urgentText, setUrgentText] = useState('Awaryjne uzupełnienie kasy');
    const [checked, setChecked] = useState(false);
    const [showUrgentCheckbox, setShowUrgentCheckbox] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        binanceService.getBinanceBalanceUSD().then((balance) => {
            setBalancePLN(utils.formatMoney(balance.balancePLN));
        });

        binanceService.getMichalBNBBalancePLN().then((balance) => {
            setMichalBNBBalancePLN(utils.formatMoney(balance));
        });
    });

    const everydayRefill = () => {
        classes.everyday = classes.everyday.slice(0, 1);
        setEverydayRefillText('Wykonuję operację');
        binanceService.everydayRefill().then(() => {
            classes.everyday.push('success');
            setEverydayRefillText('Wykonano, pieniądze dotrą w ciągu 5 min');
        }).catch(err => {
            const message = utils.extractErrorMessage(err);
            classes.everyday.push('error');
            setEverydayRefillText(message);
        });
    }

    const getClasses = (objName) => {
        return classes[objName].join(' ');
    }

    const handleChange = () => {
        classes.urgentCheckbox.push('disappear');
        setUrgentCheckboxText('Prosze czekaj...');
        setShowUrgentCheckbox(false);
        setTimeout(() => {
            setChecked(!checked);
        }, 10000);
    };

    const urgentRefill = () => {

    }

    return (
        <>
            <div className='card'>Binance card: {balancePLN} PLN</div>
            <div className='card'>MichalBNB: {michalBNBBalancePLN} PLN</div>
            <div className='card' onClick={() => navigate('/')}>Wstecz</div>
            <div className={getClasses('everyday')} onClick={() => everydayRefill()}>{everydayRefillText}</div>
            {!checked && <div className={getClasses('urgentCheckbox')}>
                <label>
                    {showUrgentCheckbox && <input type="checkbox"
                        checked={checked}
                        onChange={handleChange} />}{' '}
                    {urgentCheckboxText}
                </label>
            </div>}
            {checked && <div className={getClasses('urgent')} onClick={() => urgentRefill()}>{urgentText}</div>}
        </>
    )
}

export default RefillComponent;