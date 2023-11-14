import styles from './LoginAndRegisterForm.module.css';
import Header from "../Header";
export default function Login() {
    return (
        <>
            <Header 
                pageName="Login"
            />
            <div className="container-fluid bg-light py-4">
                <div className="container">
                    <form>
                        <div className="g-5 align-items-center">
                            <div className="form-group">
                                <label htmlFor="email">Email address</label>
                                <input type="email" id="email" aria-describedby="emailHelp" placeholder="Enter email" autoComplete="true"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <input type="password" id="password" placeholder="Password" autoComplete="true"/>
                            </div>
                        
                        </div>
                        <button type="submit" className="btn btn-primary rounded-pill py-2">Login</button>
                    </form>
                </div>
            </div>
        </>
    );
}