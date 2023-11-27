import Header from "../../Header";
import styles from "./CreateProduct.module.css";
import * as productService from "../../../services/productService";
import { useNavigate } from "react-router-dom";
import useForm from "../../hooks/useForm";
import { useState } from "react";

export default function CreateProduct() {
    const navigate = useNavigate();
    // const [errorMsg, setErrorMsg] = useState({});
    
   
    const CreateProductKeys = {
        ProductName: "name",
        Price: "price", 
        ImagerUrl: "imageUrl",
        Country: "country",
        KindProduct: "kindProduct",
        Quantity: "quantity",
        Description: "description",
    }

    const initialValues = {
        [CreateProductKeys.ProductName]: "",
        [CreateProductKeys.Price]: "",
        [CreateProductKeys.ImagerUrl]: "",
        [CreateProductKeys.Country]: "",
        [CreateProductKeys.KindProduct]: "",
        [CreateProductKeys.Quantity]: "",
        [CreateProductKeys.Description]: "",
    }

    const {values, onChange, onSubmit} = useForm(createProductSubmitHandler,initialValues);

    async function createProductSubmitHandler(values) {

        // TODO: ERROR HANDLING
        
        // if(values[CreateProductKeys.ProductName] === "") {
        //     setErrorMsg((errorMsg)=> ...errorMsg, values[CreateProductKeys.ProductName]);
        // }
            
        try {
            await productService.create(values);
            navigate("/products");
        } catch (err) {
            // To implement Error notification
            console.log(err);
        }
    };
    
    
    return (
        <>
            <Header
                pageName="Add Product"
            />
            <div className="container-fluid bg-light py-4">
                <div className="container bg-icon">
                    <form id={styles["create-page"]} onSubmit={onSubmit}>
                        <div className="g-5">
                            <div className={styles["md-2"]}>
                                <label htmlFor="itemName" className="form-label">Name:</label>
                                <input 
                                    type="text"
                                    id="itemName"
                                    name={[CreateProductKeys.ProductName]}
                                    placeholder="Item name"
                                    autoComplete="true"
                                    onChange={onChange}
                                    value={values[[CreateProductKeys.ProductName]]}
                                />
                            </div>
                            <div className={styles["md-2"]}>
                                <label htmlFor="price" className="form-label">Price:</label>
                                <input 
                                    type="text"
                                    id="price"
                                    name={[CreateProductKeys.Price]}
                                    placeholder="price"
                                    autoComplete="true"
                                    onChange={onChange}
                                    value={values[[CreateProductKeys.Price]]}

                                />
                            </div>
                            <div className={styles["md-2"]}>
                                <label htmlFor="image" className="form-label">Image Url:</label>
                                <input 
                                    type="url"
                                    id="image"
                                    name={[CreateProductKeys.ImagerUrl]}
                                    placeholder="image"
                                    autoComplete="true"
                                    onChange={onChange}
                                    value={values[[CreateProductKeys.ImagerUrl]]}

                                />
                            </div>
                            <div className={styles["md-2"]}>
                                <label htmlFor="country" className="form-label">Country:</label>
                                <input 
                                    type="text"
                                    id="country"
                                    name={[CreateProductKeys.Country]}
                                    placeholder="country"
                                    autoComplete="true"
                                    onChange={onChange}
                                    value={values[[CreateProductKeys.Country]]}

                                />
                            </div>
                            <div className={styles["md-2"]}>
                                <label htmlFor="kindProduct" className="form-label">Kind product:</label>
                                <select 
                                    id="kindProduct"
                                    name={[CreateProductKeys.KindProduct]}
                                    onChange={onChange}
                                    value={values[[CreateProductKeys.KindProduct]]}
                                >
                                    <option value="none"></option>
                                    <option value="fruit">Fruit</option>
                                    <option value="vegetable">Vegetable</option>
                                </select>
                            </div>
                            <div className={styles["md-2"]}>
                                <label htmlFor="quantity" className="form-label">Quantity in order:</label>
                                <input 
                                    type="number" 
                                    id="quantity"
                                    name={[CreateProductKeys.Quantity]}
                                    placeholder="quantity"
                                    autoComplete="true"
                                    onChange={onChange}
                                    value={values[[CreateProductKeys.Quantity]]}

                                />
                            </div>
                            <div className={styles["md-2"]}>
                                <label htmlFor="description" className="form-label">Description:</label>
                                <textarea 
                                    className="form-group"
                                    id="description"
                                    name={[CreateProductKeys.Description]}
                                    onChange={onChange}
                                    value={values[[CreateProductKeys.Description]]}
                                    autoComplete="true"

                                ></textarea>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary rounded-pill py-2 px-1">Add Product</button>
                    </form>
                </div>
            </div>

        </>
    );
}