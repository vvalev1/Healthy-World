import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import * as productService from "../../../services/productService";
import useForm from "../../hooks/useForm";
import Path from "../../../paths/paths";

import Header from "../../Header";
import styles from "./EditProduct.module.css";

export default function EditProduct() {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState("");


    const CreateProductKeys = {
        ProductName: "name",
        Price: "price", 
        ImagerUrl: "imageUrl",
        Country: "country",
        KindProduct: "kindProduct",
        Quantity: "quantity",
        Description: "description",
    };

    const initialValues = {
        [CreateProductKeys.ProductName]: "",
        [CreateProductKeys.Price]: "",
        [CreateProductKeys.ImagerUrl]: "",
        [CreateProductKeys.Country]: "",
        [CreateProductKeys.KindProduct]: "",
        [CreateProductKeys.Quantity]: "",
        [CreateProductKeys.Description]: "",
    };
    
    const {values, onChange, onSubmit, fillValuesWithLoadedData} = useForm(editProductSubmitHandler,initialValues);
    
    useEffect(() => {
        productService.getOne(productId)
        .then((result) => {fillValuesWithLoadedData(result)})
        .catch(err => {console.log(err.message)});
        
    }, [productId]);

    
    async function editProductSubmitHandler() {

        if(values[CreateProductKeys.ProductName] === "") {
            return setErrorMsg("Product name is required!");
        } else if(values[CreateProductKeys.Price] === "") {
            return setErrorMsg("Product price is required!");
        } else if(values[CreateProductKeys.ImagerUrl] === "") {
            return setErrorMsg("Product image is required!");
        } else if(values[CreateProductKeys.Country] === "") {
            return setErrorMsg("Country is required!");
        } else if(values[CreateProductKeys.Quantity] === "") {
            return setErrorMsg("Quantity is required!");
        }

        setErrorMsg("");
            
        try {
            await productService.update(values, productId);
            navigate(Path.Products);
        } catch (err) {
            // To implement Error notification
            console.log(err);
        }
    };

    return (
        <>
            <Header
                pageName="Edit Product"
            />
            <div className="container-fluid bg-light py-4">
                <div className="container bg-icon">
                    <form id={styles["edit-page"]} onSubmit={onSubmit}>
                        <div className="g-5">
                            <p id={styles["errorMsg"]}>{errorMsg}</p>
                            <div className={styles["md-2"]}>
                                <label htmlFor="itemName" className="form-label">Name:</label>
                                <input 
                                    type="text"
                                    id="itemName"
                                    name={CreateProductKeys.ProductName}
                                    placeholder="Item name"
                                    onChange={onChange}
                                    value={values[CreateProductKeys.ProductName]}
                                    autoComplete="true"
                                />
                            </div>
                            <div className={styles["md-2"]}>
                                <label htmlFor="price" className="form-label">Price:</label>
                                <input 
                                    type="text"
                                    id="price"
                                    name={CreateProductKeys.Price}
                                    placeholder="price"
                                    onChange={onChange}
                                    value={values[CreateProductKeys.Price]}
                                    autoComplete="true"
                                />
                            </div>
                            <div className={styles["md-2"]}>
                                <label htmlFor="image" className="form-label">Image Url:</label>
                                <input 
                                    type="url"
                                    id="image"
                                    name={CreateProductKeys.ImagerUrl}
                                    placeholder="imageUrl"
                                    onChange={onChange}
                                    value={values[CreateProductKeys.ImagerUrl]}
                                />
                            </div>
                            <div className={styles["md-2"]}>
                                <label htmlFor="country" className="form-label">Country:</label>
                                <input 
                                    type="text"
                                    id="country"
                                    name={CreateProductKeys.Country}
                                    placeholder="country"
                                    onChange={onChange}
                                    value={values[CreateProductKeys.Country]}
                                    autoComplete="true"
                                />
                            </div>
                            <div className={styles["md-2"]}>
                                <label htmlFor="kindProduct" className="form-label">Kind product:</label>
                                <select 
                                    id="kindProduct"
                                    name={CreateProductKeys.KindProduct}
                                    onChange={onChange}
                                    value={values[CreateProductKeys.KindProduct]}
                                >
                                    <option value="fruit">Fruit</option>
                                    <option value="vegetable">Vegetable</option>
                                </select>
                            </div>
                            <div className={styles["md-2"]}>
                                <label htmlFor="quantity" className="form-label">Quantity in order:</label>
                                <input 
                                    type="number"
                                    id="quantity"
                                    name={CreateProductKeys.Quantity}
                                    placeholder="quantity"
                                    onChange={onChange}
                                    value={values[CreateProductKeys.Quantity]}
                                />
                            </div>
                            <div className={styles["md-2"]}>
                                <label htmlFor="description" className="form-label">Description:</label>
                                <textarea 
                                    className="form-group"
                                    id="description"
                                    name={CreateProductKeys.Description}
                                    onChange={onChange}
                                    value={values[CreateProductKeys.Description]}
                                ></textarea>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary rounded-pill py-2 px-1">Edit</button>
                    </form>
                </div>
            </div>
        </>
    );
}