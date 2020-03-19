import React, { useState, useRef, useEffect } from 'react';
import api from '../service/api';
import { AxiosError } from 'axios';
import Alert from './alert';

type validate = {
    property: string;
    constraints: {
        [type: string]: string;
    };
}

const Signup: React.FC = () => {
    const [name, setName] = useState<string>();
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [error, setError] = useState<string>();
    const [inputErrors, setInputErrors] = useState<validate[]>();
    const signupForm = useRef<HTMLFormElement>(null);
    const signupBack = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        signupForm.current?.reset();
    }, []);

    const handleSignup = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        if (!name || !email || !password) {
            setError("Please type your full name, e-mail and password to sign up!");
        } else {
            console.log('vou postar')
            await api.post("/users", { name, email, password })
                .then(response => {
                    if (response.status === 201) {
                        signupForm.current?.reset();
                        signupBack.current?.click();
                    }
                }).catch((err: AxiosError) => {
                    if (err.response && err.response.status === 400) {
                        console.log(err.response.data)
                        setInputErrors(err.response.data);
                    } else {
                        setError("Server error or unavalible.")
                    }
                });
        }
    }

    return (
        <div id="signup" className="modal fade hide" role="dialog" aria-labelledby="signupLabel" aria-hidden="true">
            <div className="modal-body center">
                <h3 id="signupLabel">Sign up to VUTTR</h3>
                <form ref={signupForm} className="sign pure-form pure-form-stacked">
                    <fieldset>
                        <Alert message={error} type="error" />
                        <label htmlFor="name">Full name *</label>
                        <input id="name" name="name" type="text" placeholder="Required..." onChange={(ev: React.ChangeEvent<HTMLInputElement>): void => { setName(ev.target.value); }} required />
                        <div className="pure-g">
                            {inputErrors && inputErrors.map(erro =>
                                (erro.property === "name" &&
                                    Object.values(erro.constraints).map((value) => (
                                        <small className="error">{value}</small>
                                    ))
                                )
                            )}
                        </div>
                        <label htmlFor="email">E-mail *</label>
                        <input id="email" name="email" type="email" placeholder="Required..." onChange={(ev: React.ChangeEvent<HTMLInputElement>): void => { setEmail(ev.target.value); }} required />
                        <div className="pure-g">
                            {inputErrors && inputErrors.map(erro =>
                                (erro.property === "email" &&
                                    Object.values(erro.constraints).map((value) => (
                                        <small className="error">{value}</small>
                                    ))
                                )
                            )}
                        </div>
                        <label htmlFor="password">Password *</label>
                        <input id="password" name="password" type="password" placeholder="Required..." onChange={(ev: React.ChangeEvent<HTMLInputElement>): void => { setPassword(ev.target.value); }} required />
                        <div className="pure-g">
                            {inputErrors && inputErrors.map(erro =>
                                (erro.property === "password" &&
                                    Object.values(erro.constraints).map((value) => (
                                        <small className="error">{value}</small>
                                    ))
                                )
                            )}
                        </div>
                        <button onClick={handleSignup} className="pure-button pure-button-primary">Submit</button><br />
                    </fieldset>
                </form>
                <button id="signupBack" ref={signupBack} role="link" className="pure-button pure-button-primary" data-dismiss="modal" aria-hidden="true">voltar</button>
            </div>
        </div>
    )
};

export default Signup;
