import { AxiosError } from 'axios';
import React, { useContext, useState } from 'react';
import api from '../services/api';
import { login } from '../services/auth';
import { AppContext } from '../store';
import Alert from './alert';

const Signin: React.FC = () => {
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [error, setError] = useState<string>();
    const { dispatch } = useContext(AppContext);

    const handleSignin = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        if (!email || !password) {
            setError("Please type your e-mail and password to sign in!");
        } else {
            api.post("/login", { email, password })
                .then(response => {
                    if (response.status === 200) {
                        login(response.data.token);
                        dispatch({ type: 'logged', value: true });
                        $('#signin').modal('hide');
                    }
                }).catch((err: AxiosError) => {
                    if (err.response && err.response.status === 401) {
                        setError("Incorrect e-mail or password.");
                    } else {
                        setError("Server error or unavalible.")
                    }
                });
        }
    }

    return (
        <div id="signin" className="modal fade hide" role="dialog" aria-labelledby="signinLabel" aria-hidden="true">
            <div className="modal-body center">
                <h3 id="signinLabel">Sign in to VUTTR</h3>
                <p>Please type your e-mail and password to sign in:</p>
                <form className="sign pure-form pure-form-stacked">
                    <fieldset>
                        <Alert message={error} type="error" />
                        <input name="email" type="email" placeholder="E-mail" onChange={(ev: React.ChangeEvent<HTMLInputElement>): void => { setEmail(ev.target.value); }} />
                        <input name="password" type="password" placeholder="Password" onChange={(ev: React.ChangeEvent<HTMLInputElement>): void => { setPassword(ev.target.value); }} />
                        <button onClick={handleSignin} className="pure-button pure-button-primary">Sign in</button><br />
                    </fieldset>
                </form>
                <button id="signinBack" role="link" className="pure-button pure-button-primary" data-dismiss="modal" aria-hidden="true">voltar</button>
            </div>
        </div >
    )
};

export default Signin;
