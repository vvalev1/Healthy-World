import { Link } from "react-router-dom";

import Path from "../paths/paths";

export default function Footer() {
    return(
        <div className="container-fluid bg-dark footer pt-5 wow fadeIn" data-wow-delay="0.1s">
        <div className="container py-1">
            <div className="row g-5">
                <div className="col-lg-6 col-md-6">
                    <h1 className="fw-bold text-primary mb-4">H<span className="text-secondary">ea</span>lthy W<span className="text-secondary">or</span>ld</h1>
                    <p>Healthy products are important for living healthy life. You can find them only in Healthy World, only fresh fruit and vegetables!</p>
                </div>
                <div className="col-lg-3 col-md-6">
                    <h4 className="text-light mb-4">Address</h4>
                    <p><i className="fa fa-map-marker-alt me-3"></i>123 Street, New York, USA</p>
                    <p><i className="fa fa-phone-alt me-3"></i>+012 345 67890</p>
                    <p><i className="fa fa-envelope me-3"></i>info@example.com</p>
                </div>
                <div className="col-lg-3 col-md-6">
                    <h4 className="text-light mb-4">Quick Links</h4>
                    <Link className="btn btn-link" to={Path.Products}>Products</Link>
                    <Link className="btn btn-link" to={Path.Home}>Home</Link>
                    <Link className="btn btn-link" to={Path.About}>About Us</Link>
                </div>
            </div>
        </div>
        <div className="container-fluid copyright">
            <div className="container">
                <div className="row">
                    <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                        &copy; <a href="#">Healthy World</a>, All Right Reserved.
                    </div>
                    <div className="col-md-6 text-center text-md-end">
                        <div>Designed By <a href="https://htmlcodex.com">HTML Codex</a></div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
};