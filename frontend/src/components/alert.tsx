import React from 'react';

import { ReactComponent as Info } from '../assets/info.svg';
import { ReactComponent as Success } from '../assets/success.svg';
import { ReactComponent as Error } from '../assets/error.svg';
import { ReactComponent as Warning } from '../assets/warning.svg';

type Props = {
    message?: string,
    type: 'info' | 'success' | 'error' | 'warnning';
}

const Alert: React.FC<Props> = ({ message, type }) => (
    <>
        {message && (type === 'info' || !type) &&
            <div className="alert info" >
                <Info className="icon" /> {message}
            </div>}
        {message && type === 'success' &&
            <div className="alert success" >
                <Success className="icon" /> {message}
            </div>}
        {message && type === 'error' &&
            <div className="alert error" >
                <Error className="icon" /> {message}
            </div>}
        {message && type === 'warnning' &&
            <div className="alert warnning" >
                <Warning className="icon" /> {message}
            </div>}
    </>
);

export default Alert;
