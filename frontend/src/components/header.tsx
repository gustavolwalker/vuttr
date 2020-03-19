import React from 'react';
import { isAuthenticated, logout, getUserName } from '../service/auth';

import Signin from './signin';
import Signup from './signup';

const Header: React.FC = () => {

    const handleSignout = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        logout();
    }

    return (
        <>
            <div className="home-menu pure-menu pure-menu-horizontal">
                <div className="pure-menu-heading">
                    VUTTR
                </div>
                <ul className="pure-menu-list">
                    <li className="pure-menu-item" hidden={isAuthenticated()}>
                        <a href="#signin" className="pure-menu-link" data-toggle="modal">Sign in</a>
                    </li>
                    <li className="pure-menu-item" hidden={isAuthenticated()}>
                        <a href="#signup" className="pure-menu-link" data-toggle="modal">Sign up</a>
                    </li>
                    <li className="pure-menu-item" hidden={!isAuthenticated()}>
                        <button onClick={handleSignout} className="pure-menu-link">{getUserName()} (Sign out)</button>
                    </li>
                </ul>
            </div>
            <Signin />
            <Signup />
        </>
    );
};

export default Header;