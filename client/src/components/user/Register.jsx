import { useContext, useEffect, useState } from 'react';

import AuthContext from '../contexts/AuthContext';
import styles from './Register.module.css';
import Header from "../Header";
import useForm from '../hooks/useForm';

const RegisterKeys = {
    Email: "email",
    Password: "password",
    RepeatPassword: "repeatPassword"
}

export default function Register() {
    const { registerSubmitHandler, errorMsg } = useContext(AuthContext);

    const payload = {
        [RegisterKeys.Email]: "",
        [RegisterKeys.Password]: "",
        [RegisterKeys.RepeatPassword]: ""
    }

    const {values, onChange, onSubmit} = useForm(registerSubmitHandler, payload);

    return (
        <>
            <Header 
                pageName="Register"
            />
            <div className="container-fluid bg-light py-4">
                <div className="container">
                    <form id={styles["register-page"]} onSubmit={onSubmit}>
                        <div className="g-5 align-items-center">
                            <p id={styles["errorMsg"]}>{errorMsg}</p>
                            <div className={styles["md-2"]}>
                                <label htmlFor="email">Email:</label>
                                <input 
                                    type="email" 
                                    id="email" 
                                    name={RegisterKeys.Email} 
                                    placeholder="Enter email"
                                    value={values[RegisterKeys.Email]}
                                    onChange={onChange}  
                                />
                            </div>
                            <div className={styles["md-2"]}>
                                <label htmlFor="password">Password:</label>
                                <input 
                                    type="password" 
                                    id="password" 
                                    name={RegisterKeys.Password} 
                                    placeholder="Password" 
                                    value={values[RegisterKeys.Password]}
                                    onChange={onChange} 
                                />
                            </div>
                            <div className={styles["md-2"]}>
                                <label htmlFor="repeatPassword">Repeat Password:</label>
                                <input 
                                    type="password"
                                    id="repeatPassword"
                                    name={RegisterKeys.RepeatPassword}
                                    placeholder="Password"
                                    value={values[RegisterKeys.RepeatPassword]}
                                    onChange={onChange}
                                />
                            </div>
                        
                        </div>
                        <button type="submit" className="btn btn-primary rounded-pill py-2">Register</button>
                    </form>
                </div>
            </div>
        </>
    );
}