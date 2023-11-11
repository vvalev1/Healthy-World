import { Link } from 'react-router-dom';
import HomeComponent from './Home';
export default function NavigationBarComponent() {
    return(
        
        <div className="container-fluid fixed-top px-0 wow fadeIn" data-wow-delay="0.1s">
            {/* <div class="top-bar row gx-0 align-items-center d-none d-lg-flex">
                <div class="col-lg-6 px-5 text-start">
                    <small><i class="fa fa-map-marker-alt me-2"></i>123 Street, New York, USA</small>
                    <small class="ms-4"><i class="fa fa-envelope me-2"></i>info@example.com</small>
                </div>
                <div class="col-lg-6 px-5 text-end">
                    <small>Follow us:</small>
                    <a class="text-body ms-3" href=""><i class="fab fa-facebook-f"></i></a>
                    <a class="text-body ms-3" href=""><i class="fab fa-twitter"></i></a>
                    <a class="text-body ms-3" href=""><i class="fab fa-linkedin-in"></i></a>
                    <a class="text-body ms-3" href=""><i class="fab fa-instagram"></i></a>
                </div>
            </div> */}
    
            <nav className="navbar navbar-expand-lg navbar-light py-lg-0 px-lg-5 wow fadeIn" data-wow-delay="0.1s">
                <Link to="/" element={<HomeComponent/>} className="navbar-brand ms-4 ms-lg-0">
                    <h1 className="fw-bold text-primary m-0">F<span className="text-secondary">oo</span>dy</h1>
                </Link>
                
                <button type="button" className="navbar-toggler me-4" data-bs-toggle="collapse" data-bs-target="#navbarCollapse">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarCollapse">
                    <div className="navbar-nav ms-auto p-4 p-lg-0">
                        <Link to="/" element={<HomeComponent/>} className="nav-item nav-link active">Home</Link>
                        <Link to="/about" className="nav-item nav-link">About Us</Link>
                        <Link href="product.html" className="nav-item nav-link">Products</Link>
                        <div className="nav-item dropdown">
                            <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Pages</a>
                            <div className="dropdown-menu m-0">
                                <a href="blog.html" className="dropdown-item">Blog Grid</a>
                                <a href="feature.html" className="dropdown-item">Our Features</a>
                                <a href="testimonial.html" className="dropdown-item">Testimonial</a>
                                <a href="404.html" className="dropdown-item">404 Page</a>
                            </div>
                        </div>
                        <a href="contact.html" className="nav-item nav-link">Contact Us</a>
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