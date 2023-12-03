import { useEffect, useState } from "react";

import * as productService from "../../services/productService";

import Header from "../Header";
import ProductItem from "./productItem/ProductItem";

export default function Products() {
    const [products, setProducts] = useState([]);
    const [productKind, setProductKind] = useState("allProducts");

    const productTypeHandler = (e) => {
        const currentButton = e.target;
        const pKind = currentButton.name;

        setProductKind(pKind);
    }

    useEffect(() => {
        if(productKind === "allProducts") {
            productService.getAll()
                .then(results => setProducts(results))
                .catch((err)=>console.log(err.message));
        } else {
            productService.getAllByKind(productKind)
                .then(results => setProducts(results))
                .catch((err) => console.log(err));
        }

    }, [productKind]);
 

    return (
        <>
            <Header pageName="Products" />
            <div className="container-xxl py-5">
                <div className="container">
                    <div className="row g-0 gx-5 align-items-end">
                        <div className="col-lg-4 text-start text-lg-start wow slideInRight" data-wow-delay="0.1s">
                            <ul className="nav nav-pills d-inline-flex justify-content-end mb-5">
                                <li className="nav-item me-2">
                                    <button className="btn btn-outline-primary border-2 active" data-bs-toggle="pill" name="allProducts" onClick={productTypeHandler}>All Products</button>
                                </li>
                                <li className="nav-item me-2">
                                    <button className="btn btn-outline-primary border-2" data-bs-toggle="pill" name="vegetable" onClick={productTypeHandler}>Vegetable</button>
                                </li>
                                <li className="nav-item me-2">
                                    <button className="btn btn-outline-primary border-2" data-bs-toggle="pill" name="fruit" onClick={productTypeHandler}>Fruits</button>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="tab-content">
                        <div className="row fade show p-0">
                            { products.length > 0 && products.map(productItem => 
                                    
                                   (<ProductItem key={productItem._id} {...productItem}/>
                            ))
                            }
                        </div>
                        {products.length === 0 && (
                                <h3>No products yet</h3>
                            )}
                    </div>
                </div>
            </div>
        </>
    );
}