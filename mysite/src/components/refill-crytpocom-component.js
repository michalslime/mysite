import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import apiService from '../services/api-service';
import utils from '../services/utils';

const classes = {
    everyday: ['card'],
    urgentCheckbox: ['card'],
    urgent: ['card'],
    urgentRefillInProgress: ['card'],
}

function RefillCryptoComComponent() {
    const [frugalMATICBalancePLN, setFrugalMATICBalancePLN] = useState(0);
    const [everydayRefillText, setEverydayRefillText] = useState('Uzupełnienie codzienne');
    const [urgentCheckboxText, setUrgentCheckboxText] = useState('Awaryjnie potrzebuję kasy');
    const [urgentText, setUrgentText] = useState('Awaryjne uzupełnienie kasy');
    const [checked, setChecked] = useState(false);
    const [showUrgentCheckbox, setShowUrgentCheckbox] = useState(true);
    const [urgentRefillInProgress, setUrgentRefillInProgress] = useState(false);
    const [cancelUrgentText, setCancelUrgentText] = useState('Anuluj awaryjne uzupełnienie');
    const navigate = useNavigate();

    useEffect(() => {
        classes.everyday = classes.everyday.slice(0, 1);
        classes.urgentCheckbox = classes.urgentCheckbox.slice(0, 1);
        classes.urgent = classes.urgent.slice(0, 1);
        classes.urgentRefillInProgress = classes.urgentRefillInProgress.slice(0, 1);

        apiService.getFrugalMATICBalancePLN().then((balance) => {
            setFrugalMATICBalancePLN(utils.formatMoney(balance));
        });

        apiService.getTimeouts().then((data) => {
            setUrgentRefillInProgress(data.urgentRefillTimeout);

            if (data.urgentRefillTimeout) {
                setUrgentText('Awaryjne uzupełnienie w toku...');
            }
        });
    }, []);

    const everydayRefill = () => {
        classes.everyday = classes.everyday.slice(0, 1);
        setEverydayRefillText('Wykonuję operację');
        apiService.everydayRefillMatic().then(() => {
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
        apiService.urgentRefill().then((data) => {
            setUrgentRefillInProgress(data.urgentRefillTimeout);
            classes.urgent.push('success');
            setUrgentText('Wykonano, pieniądze dotrą w ciągu 15 minut, możesz anulować tę operację');
        }).catch(err => {
            const message = utils.extractErrorMessage(err);
            classes.urgent.push('error');
            setUrgentText(message);
        });
    }

    const cancelUrgentRefill = () => {
        apiService.cancelUrgentRefill().then((data) => {
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
            <div className='card'>Frugal MATIC: {frugalMATICBalancePLN} PLN</div>
            <div className={getClasses('everyday')} onClick={() => everydayRefill()}>{everydayRefillText}</div>
            {false && !checked && !urgentRefillInProgress && <div className={getClasses('urgentCheckbox')} onClick={() => handleChange()} >
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

export default RefillCryptoComComponent;