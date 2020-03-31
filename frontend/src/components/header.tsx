import React, { useContext } from 'react';
import { getUserName, logout } from '../services/auth';
import { AppContext } from '../store';
import Signin from './signin';
import Signup from './signup';

const Header: React.FC = () => {
    const { state, dispatch } = useContext(AppContext);

    const handleSignout = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        dispatch({ type: 'logged', value: false });
        logout();
    }

    return (
        <>
            <div className="home-menu pure-menu pure-menu-horizontal">
                <div className="pure-menu-heading">
                    VUTTR
                </div>
                <ul className="pure-menu-list">
                    <li className="pure-menu-item" hidden={state.isLogged}>
                        <a href="#signin" className="pure-menu-link" data-toggle="modal">Sign in</a>
                    </li>
                    <li className="pure-menu-item" hidden={state.isLogged}>
                        <a href="#signup" className="pure-menu-link" data-toggle="modal">Sign up</a>
                    </li>
                    <li className="pure-menu-item" hidden={!state.isLogged}>
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