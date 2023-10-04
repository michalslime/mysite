import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import binanceService from '../services/api-service';
import utils from '../services/utils';

const classes = {
    everyday: ['card'],
    urgentCheckbox: ['card'],
    urgent: ['card'],
    urgentRefillInProgress: ['card'],
}

function RefillComponent() {
    const [balancePLN, setBalancePLN] = useState(0);
    const [michalBNBBalancePLN, setMichalBNBBalancePLN] = useState(0);
    const [everydayRefillText, setEverydayRefillText] = useState('Uzupełnienie codzienne');
    const [urgentCheckboxText, setUrgentCheckboxText] = useState('Awaryjnie potrzebuję kasy');
    const [urgentText, setUrgentText] = useState('Awaryjne uzupełnienie kasy');
    const [checked, setChecked] = useState(false);
    const [showUrgentCheckbox, setShowUrgentCheckbox] = useState(true);
    const [urgentRefillInProgress, setUrgentRefillInProgress] = useState(false);
    const [cancelUrgentText, setCancelUrgentText] = useState('Anuluj awaryjne uzupełnienie');
    const navigate = useNavigate();

    useEffect(() => {
        binanceService.getBinanceBalanceUSD().then((balance) => {
            setBalancePLN(utils.formatMoney(balance.balancePLN));
        });

        binanceService.getMichalBNBBalancePLN().then((balance) => {
            setMichalBNBBalancePLN(utils.formatMoney(balance));
        });

        binanceService.getTimeouts().then((data) => {
            setUrgentRefillInProgress(data.urgentRefillTimeout);

            if (data.urgentRefillTimeout) {
                setUrgentText('Awaryjne uzupełnienie w toku...');
            }
        });
    }, []);

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
        }, 9000);
    };

    const urgentRefill = () => {
        classes.urgent = classes.urgent.slice(0, 1);
        setUrgentText('Wykonuję operację...');
        binanceService.urgentRefill().then((data) => {
            setUrgentRefillInProgress(data.urgentRefillTimeout);
            classes.urgent.push('success');
            setUrgentText('Wykonano, pieniądze dotrą w ciągu 1 godziny');
        }).catch(err => {
            const message = utils.extractErrorMessage(err);
            classes.urgent.push('error');
            setUrgentText(message);
        });
    }

    const cancelUrgentRefill = () => {
        binanceService.cancelUrgentRefill().then((data) => {
            classes.urgentRefillInProgress.push('success');
            setCancelUrgentText('Anulowano, odśwież stronę');
        }).catch(err => {
            const message = utils.extractErrorMessage(err);
            classes.urgentRefillInProgress.push('error');
            setCancelUrgentText(message);
        });
    }

    return (
        <>
            <div className='card'>Binance card: {balancePLN} PLN</div>
            <div className='card'>MichalBNB: {michalBNBBalancePLN} PLN</div>
            <div className='card' onClick={() => navigate('/')}>Wstecz</div>
            <div className={getClasses('everyday')} onClick={() => everydayRefill()}>{everydayRefillText}</div>
            {!checked && !urgentRefillInProgress && <div className={getClasses('urgentCheckbox')} onClick={() => handleChange()} >
                <label>
                    {showUrgentCheckbox && <input type="checkbox"
                        checked={checked}
                    />}{' '}
                    {urgentCheckboxText}
                </label>
            </div >}
            {(checked || urgentRefillInProgress) && <div className={getClasses('urgent')} onClick={() => urgentRefill()}>{urgentText}</div>}
            {urgentRefillInProgress && <div className={getClasses('urgentRefillInProgress')} onClick={() => cancelUrgentRefill()}> {cancelUrgentText}</div>}
        </>
    )
}

export default RefillComponent;