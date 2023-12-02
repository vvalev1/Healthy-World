import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import * as productService from "../../../services/productService"
import Path from "../../../paths/paths";
import AuthContext from "../../contexts/AuthContext";
import { pathToUrl } from "../../../utils/pathToUrl";

import Header from "../../Header";
import styles from "./ProductDetails.module.css"

export default function Details() {
    const navigate = useNavigate();
    const [product, setProduct] = useState({});
    const { productId } = useParams();
    const { isAuthenticated, userId } = useContext(AuthContext);


    useEffect(() => {
        productService.getOne(productId)
            .then((result) => setProduct(result))
            .catch((err) => console.log(err.message));
    }, [productId]);

    const deleteProductHandler = async () => {
        try {
            await productService.remove(productId);
            navigate(Path.Products);
            
        } catch (error) {
            console.log(error);            
        }
    }

    const buyProductHandler = () => {
        if(!isAuthenticated) {
            navigate(Path.Login);
        }

        // TODO: buy a product 
    }

    return (
        <>
            <Header
                pageName="Product Details"
            />
            <div className="container .col-lg-3 col-md-9">
                <div className={styles["card"]}>
                    <div className="card-body">
                        <div className="row">
                            <div className="col-lg-5  col-md-6 col-sm-7">
                                <div className="white-box text-center"><img src={product.imageUrl} className={styles["img-responsive"]}/></div>
                            </div>
                            <div className="col-lg-7 col-md-9 col-sm-4">
                                <h2 className=" mt-5">{product.name}</h2>
                                <h4 className="mt-5">Price: <span>${product.price}</span></h4>
                                <button className="btn btn-primary" onClick={buyProductHandler}>Buy Now</button>
                                <div className="mt-4">
                                    {isAuthenticated && userId === product._ownerId && (
                                        <>
                                            <Link to={pathToUrl(Path.EditProduct, { productId })} className="btn btn-secondary mx-2 px-4 rounded-pill">Edit</Link>
                                            <button className="btn btn-danger rounded-pill px-4" onClick={deleteProductHandler}>Delete</button>
                                        </>
                                    )}
                                </div>
                                <h5 className="box-title mt-5">General information: </h5>
                                <ul className={styles["list-unstyled"]}>
                                    <li><span>Country:</span> {product.country}</li>
                                    <li><span>Kind:</span> {product.kindProduct}</li>
                                    <li><span>Quantity:</span> {product.quantity} kg.</li>
                                </ul>
                                <h5 className="box-title mt-5">Additional information:</h5>
                                <p>{product.description}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}