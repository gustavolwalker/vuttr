import React from 'react';

type Props = {
    message?: string,
    type: 'info' | 'error' | 'warnning';
}

const Alert: React.FC<Props> = ({ message, type }) => (
    message ?
        <div className={"alert " + type} > {message}</div>
        : <></>
);

export default Alert;
