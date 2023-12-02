import { Link } from 'react-router-dom';

import Path from "../paths/paths"
import { useContext } from 'react';
import AuthContext from './contexts/AuthContext';


export default function NavigationBarComponent() {
    const { username, isAuthenticated} = useContext(AuthContext);

    return(
        <div className="container-fluid fixed-top px-0 wow fadeIn" data-wow-delay="0.1s">    
            <nav className="navbar navbar-expand-lg navbar-light py-lg-0 px-lg-5 wow fadeIn" data-wow-delay="0.1s">
                <Link to={Path.Home} className="navbar-brand ms-4 ms-lg-0">
                    <h1 className="fw-bold text-primary m-0">H<span className="text-secondary">ea</span>lthy W<span className="text-secondary">or</span>ld</h1>
                </Link>
                
                <button type="button" className="navbar-toggler me-4" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarCollapse">
                    <div className="navbar-nav ms-auto p-4 p-lg-0">
                        <Link to={Path.Home} className="nav-item nav-link active">Home</Link>
                        <Link to={Path.Products} className="nav-item nav-link">Products</Link>
                        <Link to={Path.About} className="nav-item nav-link">About Us</Link>
                        {isAuthenticated && (
                            <div id="user" style={{display: 'inline-flex'}}>
                                <Link to={Path.CreateProduct} className="nav-item nav-link">Add Product</Link>
                                <Link to={Path.Logout} className="nav-item nav-link">Logout</Link>
                                <p id="userName" style={{marginTop: "25px"}}>Welcome, {username}</p>
                            </div>)
                        }       

                        {!isAuthenticated && (
                            <div id="guest" style={{display: 'inline-flex'}}>
                                <Link to={Path.Login} className="nav-item nav-link">Login</Link>
                                <Link to={Path.Register} className="nav-item nav-link">Register</Link>
                            </div>)
                        }

                    </div>
                    <div className="d-none d-lg-flex ms-2">
                        <a className="btn-sm-square bg-white rounded-circle ms-3" href="">
                            <small className="fa fa-search text-body"></small>
                        </a>
                    </div>
                </div>
            </nav>
        </div>
    
    );
}