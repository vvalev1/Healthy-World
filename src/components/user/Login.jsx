import styles from './Login.module.css';
import Header from "../Header";
export default function Login() {
    return (
        <>
            <Header 
                pageName="Login"
            />
            <div className="container-fluid bg-light bg-icon my-2 py-6">
                <div className="container">
                    <form>
                        <div className="g-5 align-items-center">
                            <div className="form-group">
                                <label htmlFor="exampleInputEmail1">Email address</label>
                                <input type="email" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"/>
                            </div>
                            <div className="form-group">
                                <label htmlFor="exampleInputPassword1">Password</label>
                                <input type="password" id="exampleInputPassword1" placeholder="Password"/>
                            </div>
                        
                        </div>
                        <button type="submit" className="btn btn-primary">Login</button>
                    </form>
                </div>
            </div>
        </>
    );
}