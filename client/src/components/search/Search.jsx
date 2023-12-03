import { useState } from "react";

import * as productService from "../../services/productService";
import styles from "./Search.module.css"

import Header from "../Header";
import ProductItem from "../Products/productItem/ProductItem";
import useForm from "../hooks/useForm";

export default function Search() {
    const [products, setProducts] = useState([]);

    const searchProductHandler = () => {
        
        productService.getAllByName(values.name)
            .then(results => setProducts(results))
            .catch((err) => console.log(err));
    }

    const { values, onChange, onSubmit } = useForm(searchProductHandler,"");


    return (
        <>
            <Header pageName="Search" />
            <div className="container-fluid bg-light py-4">
                <div className="container">
                    <form id={styles["search-page"]} onSubmit={onSubmit}>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Search by product name"
                            onChange={onChange}
                            value={values["name"]}
                            autoComplete="true"
                        />

                        <button type="submit" className="btn btn-primary rounded-pill py-1"><small className="fa fa-search"></small> Search</button>
                    </form>
                </div>


                <div className="tab-content">
                    <div className="row fade show p-0">
                        {products.length > 0 && products.map(productItem =>

                        (<ProductItem key={productItem._id} {...productItem} />
                        ))
                        }
                    </div>
                    <div id={styles["notFoundProduct"]}>
                        {products.length === 0 && (
                            <h3>Not found products</h3>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}