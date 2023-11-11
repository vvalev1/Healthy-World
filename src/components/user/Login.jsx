import styles from './Login.module.css';
export default function Login() {
    return (
        
            <div className="container-fluid bg-light bg-icon my-5 py-6">
                <div className="container">
                    <div className="section-header text-center mx-auto mb-5 wow fadeInUp" data-wow-delay="0.1s">
                        <h1 className="display-5 mb-3">Login</h1>
                    </div>
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
        
    );
}