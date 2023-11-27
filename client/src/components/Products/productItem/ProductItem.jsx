import { Link } from "react-router-dom";

export default function ProductItem(
    { name, price, imageUrl }
) {
    return (
                <div className="col-xl-3 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                    <div className="product-item">
                        <div className="position-relative bg-light overflow-hidden">
                            <img className="img-fluid w-100" style={{height: "20em"}} src={imageUrl} alt="" />
                        </div>
                        <div className="text-center p-4">
                            <Link to="/products/details" className="d-block h5 mb-2">{name}</Link>
                            <span className="text-primary me-1">${price}</span>
                        </div>
                    </div>
                </div>
    );
}