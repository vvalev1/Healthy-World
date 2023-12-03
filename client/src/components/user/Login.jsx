import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';

import useForm from '../hooks/useForm';
import Path from '../../paths/paths';

import styles from './Login.module.css';
import Header from "../Header";
import AuthContext from '../contexts/AuthContext';


const LoginFormKeys = {
    Email: "email",
    Password: "password"
}

export default function Login() {
  
    const { loginSubmitHandler, errorMsg, setErrorMessage } = useContext(AuthContext);

    useEffect(() => {setErrorMessage("")}, []);

    const payload = {
        [LoginFormKeys.Email]: "",
        [LoginFormKeys.Password]: ""
    }

    const {values, onChange, onSubmit} = useForm(loginSubmitHandler, payload);


    return (
        <>
            <Header 
                pageName="Login"
            />
            <div className="container-fluid bg-light py-4">
                <div className="container">
                    <form id={styles["login-page"]} onSubmit={onSubmit}>
                        <div className="g-5 align-items-center">
                            <p id={styles["errorMsg"]}>{errorMsg}</p>
                            <div className={styles["md-2"]}>
                                <label htmlFor="email">Email:</label>
                                <input 
                                    type="email" 
                                    id="email"
                                    name={LoginFormKeys.Email}  
                                    placeholder="Enter email" 
                                    onChange={onChange}
                                    value={values[LoginFormKeys.Email]}
                                    autoComplete="true"
                                />
                            </div>
                            <div className={styles["md-2"]}>
                                <label htmlFor="password">Password:</label>
                                <input 
                                    type="password" 
                                    id="password"
                                    name={LoginFormKeys.Password} 
                                    placeholder="Password" 
                                    onChange={onChange}
                                    value={values[LoginFormKeys.Password]}
                                />
                            </div>
                            <p>You have not registered yet? <Link to={Path.Register}>Register here</Link></p>
                        </div>
                        <button type="submit" className="btn btn-primary rounded-pill py-2">Login</button>
                    </form>
                </div>
            </div>
        </>
    );
}