import { Link } from 'react-router-dom';
import Home from './Home';
import Login from './user/Login';
import Register from './user/Register';
import AddItem from './Products/create/AddItem';
import Products from './Products/Products';
import About from './About';

export default function NavigationBarComponent() {
    return(
        
        <div className="container-fluid fixed-top px-0 wow fadeIn" data-wow-delay="0.1s">
             {/* <div class="top-bar row gx-0 align-items-center d-none d-lg-flex"> */}
                {/* <div class="col-lg-6 px-5 text-start">
                    <small><i class="fa fa-map-marker-alt me-2"></i>123 Street, New York, USA</small>
                    <small class="ms-4"><i class="fa fa-envelope me-2"></i>info@example.com</small>
                </div> */}
                {/* <div class="col-lg-6 px-5 text-end">
                    <small>Follow us:</small>
                    <a class="text-body ms-3" href=""><i class="fab fa-facebook-f"></i></a>
                    <a class="text-body ms-3" href=""><i class="fab fa-twitter"></i></a>
                    <a class="text-body ms-3" href=""><i class="fab fa-linkedin-in"></i></a>
                    <a class="text-body ms-3" href=""><i class="fab fa-instagram"></i></a>
                </div> */}
            {/* </div> */}
    
            <nav className="navbar navbar-expand-lg navbar-light py-lg-0 px-lg-5 wow fadeIn" data-wow-delay="0.1s">
                <Link to="/" element={<Home/>} className="navbar-brand ms-4 ms-lg-0">
                    <h1 className="fw-bold text-primary m-0">H<span className="text-secondary">ea</span>lthy W<span className="text-secondary">or</span>ld</h1>
                </Link>
                
                <button type="button" className="navbar-toggler me-4" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarCollapse">
                    <div className="navbar-nav ms-auto p-4 p-lg-0">
                        <Link to="/" element={<Home/>} className="nav-item nav-link active">Home</Link>
                        <Link to="/about" element={<About/>} className="nav-item nav-link">About Us</Link>
                        <Link to="/products" element={<Products/>} className="nav-item nav-link">Products</Link>
                        <Link to="/create" element={<AddItem/>} className="nav-item nav-link">Add Item</Link>
                        <Link to="/login" element={<Login/>} className="nav-item nav-link">Login</Link>
                        <Link to="/register" element={<Register/>} className="nav-item nav-link">Register</Link>
                    </div>
                    <div className="d-none d-lg-flex ms-2">
                        <a className="btn-sm-square bg-white rounded-circle ms-3" href="">
                            <small className="fa fa-search text-body"></small>
                        </a>
                        <a className="btn-sm-square bg-white rounded-circle ms-3" href="">
                            <small className="fa fa-user text-body"></small>
                        </a>
                        <a className="btn-sm-square bg-white rounded-circle ms-3" href="">
                            <small className="fa fa-shopping-bag text-body"></small>
                        </a>
                    </div>
                </div>
            </nav>
        </div>
    
    );
}