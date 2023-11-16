import Header from "../Header";
import { Link } from "react-router-dom";
export default function Products() {
    return (
        <>
            <Header pageName="Products" />
            <div className="container-xxl py-5">
                <div className="container">
                    <div className="row g-0 gx-5 align-items-end">
                        <div className="col-lg-3 text-start text-lg-end wow slideInRight" data-wow-delay="0.1s">
                            <ul className="nav nav-pills d-inline-flex justify-content-end mb-5">
                                <li className="nav-item me-2">
                                    <a className="btn btn-outline-primary border-2 active" data-bs-toggle="pill" href="#tab-1">Vegetable</a>
                                </li>
                                <li className="nav-item me-2">
                                    <a className="btn btn-outline-primary border-2" data-bs-toggle="pill" href="#tab-2">Fruits </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="tab-content">
                        <div id="tab-1" className="tab-pane fade show p-0 active">
                            <div className="row g-4">
                                <div className="col-xl-3 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                                    <div className="product-item">
                                        <div className="position-relative bg-light overflow-hidden">
                                            <img className="img-fluid w-100" src="/public/img/product-1.jpg" alt=""/>
                                                <div className="bg-secondary rounded text-white position-absolute start-0 top-0 m-4 py-1 px-3">New</div>
                                        </div>
                                        <div className="text-center p-4">
                                            <Link to="/products/details" className="d-block h5 mb-2">Fresh Tomato</Link>
                                            <span className="text-primary me-1">$19.00</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.3s">
                                    <div className="product-item">
                                        <div className="position-relative bg-light overflow-hidden">
                                            <img className="img-fluid w-100" src="/public/img/product-2.jpg" alt=""/>
                                                <div className="bg-secondary rounded text-white position-absolute start-0 top-0 m-4 py-1 px-3">New</div>
                                        </div>
                                        <div className="text-center p-4">
                                            <Link to="/products/details" className="d-block h5 mb-2">Fresh Tomato</Link>
                                            <span className="text-primary me-1">$19.00</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.5s">
                                    <div className="product-item">
                                        <div className="position-relative bg-light overflow-hidden">
                                            <img className="img-fluid w-100" src="/public/img/product-3.jpg" alt=""/>
                                                <div className="bg-secondary rounded text-white position-absolute start-0 top-0 m-4 py-1 px-3">New</div>
                                        </div>
                                        <div className="text-center p-4">
                                            <Link to="/products/details" className="d-block h5 mb-2">Fresh Tomato</Link>
                                            <span className="text-primary me-1">$19.00</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.7s">
                                    <div className="product-item">
                                        <div className="position-relative bg-light overflow-hidden">
                                            <img className="img-fluid w-100" src="/public/img/product-4.jpg" alt=""/>
                                                <div className="bg-secondary rounded text-white position-absolute start-0 top-0 m-4 py-1 px-3">New</div>
                                        </div>
                                        <div className="text-center p-4">
                                            <Link to="/products/details" className="d-block h5 mb-2">Fresh Tomato</Link>
                                            <span className="text-primary me-1">$19.00</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                                    <div className="product-item">
                                        <div className="position-relative bg-light overflow-hidden">
                                            <img className="img-fluid w-100" src="/public/img/product-5.jpg" alt=""/>
                                                <div className="bg-secondary rounded text-white position-absolute start-0 top-0 m-4 py-1 px-3">New</div>
                                        </div>
                                        <div className="text-center p-4">
                                            <Link to="/products/details" className="d-block h5 mb-2">Fresh Tomato</Link>
                                            <span className="text-primary me-1">$19.00</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.3s">
                                    <div className="product-item">
                                        <div className="position-relative bg-light overflow-hidden">
                                            <img className="img-fluid w-100" src="/public/img/product-6.jpg" alt=""/>
                                                <div className="bg-secondary rounded text-white position-absolute start-0 top-0 m-4 py-1 px-3">New</div>
                                        </div>
                                        <div className="text-center p-4">
                                            <Link to="/products/details" className="d-block h5 mb-2">Fresh Tomato</Link>
                                            <span className="text-primary me-1">$19.00</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.5s">
                                    <div className="product-item">
                                        <div className="position-relative bg-light overflow-hidden">
                                            <img className="img-fluid w-100" src="/public/img/product-7.jpg" alt=""/>
                                                <div className="bg-secondary rounded text-white position-absolute start-0 top-0 m-4 py-1 px-3">New</div>
                                        </div>
                                        <div className="text-center p-4">
                                            <Link to="/products/details" className="d-block h5 mb-2">Fresh Tomato</Link>
                                            <span className="text-primary me-1">$19.00</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.7s">
                                    <div className="product-item">
                                        <div className="position-relative bg-light overflow-hidden">
                                            <img className="img-fluid w-100" src="/public/img/product-8.jpg" alt=""/>
                                                <div className="bg-secondary rounded text-white position-absolute start-0 top-0 m-4 py-1 px-3">New</div>
                                        </div>
                                        <div className="text-center p-4">
                                            <Link to="/products/details" className="d-block h5 mb-2">Fresh Tomato</Link>
                                            <span className="text-primary me-1">$19.00</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-12 text-center wow fadeInUp" data-wow-delay="0.1s">
                                    <a className="btn btn-primary rounded-pill py-3 px-5" href="">Browse More Products</a>
                                </div>
                            </div>
                        </div>
                        <div id="tab-2" className="tab-pane fade show p-0">
                            <div className="row g-4">
                                <div className="col-xl-3 col-lg-4 col-md-6">
                                    <div className="product-item">
                                        <div className="position-relative bg-light overflow-hidden">
                                            <img className="img-fluid w-100" src="/public/img/product-1.jpg" alt=""/>
                                                <div className="bg-secondary rounded text-white position-absolute start-0 top-0 m-4 py-1 px-3">New</div>
                                        </div>
                                        <div className="text-center p-4">
                                            <Link to="/products/details" className="d-block h5 mb-2">Fresh Tomato</Link>
                                            <span className="text-primary me-1">$19.00</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-lg-4 col-md-6">
                                    <div className="product-item">
                                        <div className="position-relative bg-light overflow-hidden">
                                            <img className="img-fluid w-100" src="/public/img/product-2.jpg" alt=""/>
                                                <div className="bg-secondary rounded text-white position-absolute start-0 top-0 m-4 py-1 px-3">New</div>
                                        </div>
                                        <div className="text-center p-4">
                                            <Link to="/products/details" className="d-block h5 mb-2">Fresh Tomato</Link>
                                            <span className="text-primary me-1">$19.00</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-lg-4 col-md-6">
                                    <div className="product-item">
                                        <div className="position-relative bg-light overflow-hidden">
                                            <img className="img-fluid w-100" src="/public/img/product-3.jpg" alt=""/>
                                                <div className="bg-secondary rounded text-white position-absolute start-0 top-0 m-4 py-1 px-3">New</div>
                                        </div>
                                        <div className="text-center p-4">
                                            <Link to="/products/details" className="d-block h5 mb-2">Fresh Tomato</Link>
                                            <span className="text-primary me-1">$19.00</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-lg-4 col-md-6">
                                    <div className="product-item">
                                        <div className="position-relative bg-light overflow-hidden">
                                            <img className="img-fluid w-100" src="/public/img/product-4.jpg" alt=""/>
                                                <div className="bg-secondary rounded text-white position-absolute start-0 top-0 m-4 py-1 px-3">New</div>
                                        </div>
                                        <div className="text-center p-4">
                                            <Link to="/products/details" className="d-block h5 mb-2">Fresh Tomato</Link>
                                            <span className="text-primary me-1">$19.00</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-lg-4 col-md-6">
                                    <div className="product-item">
                                        <div className="position-relative bg-light overflow-hidden">
                                            <img className="img-fluid w-100" src="/public/img/product-5.jpg" alt=""/>
                                                <div className="bg-secondary rounded text-white position-absolute start-0 top-0 m-4 py-1 px-3">New</div>
                                        </div>
                                        <div className="text-center p-4">
                                            <Link to="/products/details" className="d-block h5 mb-2">Fresh Tomato</Link>
                                            <span className="text-primary me-1">$19.00</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-3 col-lg-4 col-md-6">
                                    <div className="product-item">
                                        <div className="position-relative bg-light overflow-hidden">
                                            <img className="img-fluid w-100" src="/public/img/product-6.jpg" alt=""/>
                                                <div className="bg-secondary rounded text-white position-absolute start-0 top-0 m-4 py-1 px-3">New</div>
                                        </div>
                                        <div className="text-center p-4">
                                            <Link to="/products/details" className="d-block h5 mb-2">Fresh Tomato</Link>
                                            <span className="text-primary me-1">$19.00</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}