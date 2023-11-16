import styles from './Register.module.css';
import Header from "../Header";
export default function Register() {
    return (
        <>
            <Header 
                pageName="Register"
            />
            <div className="container-fluid bg-light py-4">
                <div className="container">
                    <form id={styles["register-page"]}>
                        <div className="g-5 align-items-center">
                            <div className={styles["md-2"]}>
                                <label htmlFor="email">Email:</label>
                                <input type="email" id="email" name="email" aria-describedby="emailHelp" placeholder="Enter email" autoComplete="true" />
                            </div>
                            <div className={styles["md-2"]}>
                                <label htmlFor="password">Password:</label>
                                <input type="password" id="password" name="password" placeholder="Password" autoComplete="true" />
                            </div>
                            <div className={styles["md-2"]}>
                                <label htmlFor="repeatPassword">Repeat Password:</label>
                                <input type="password" id="repeatPassword" name="repeatPassword" placeholder="Password" autoComplete="true" />
                            </div>
                        
                        </div>
                        <button type="submit" className="btn btn-primary rounded-pill py-2">Register</button>
                    </form>
                </div>
            </div>
        </>
    );
}