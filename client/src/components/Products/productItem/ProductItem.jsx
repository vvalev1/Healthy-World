import { Link } from "react-router-dom";

import Path from "../../../paths/paths";
import { pathToUrl } from "../../../utils/pathToUrl";

export default function ProductItem(
    { _id ,name, price, imageUrl }
) {
    return (
                <div className="col-xl-3 col-lg-4 col-md-6 wow fadeInUp" data-wow-delay="0.1s">
                    <div className="product-item">
                        <div className="position-relative bg-light overflow-hidden">
                        <Link to={`/products/${_id}`}><img className="img-fluid w-100" style={{height: "20em"}} src={imageUrl} /></Link>
                        </div>
                        <div className="text-center p-4">
                            <Link to={`/products/${_id}`} className="d-block h5 mb-2">{name}</Link>
                            <span className="text-primary me-1">${price}</span>
                        </div>
                    </div>
                </div>
    );
}