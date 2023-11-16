import Header from "../../Header";
import styles from "./CreateProduct.module.css";
import * as productService from "../../../services/productService";
import { useNavigate } from "react-router-dom";

export default function CreateProduct() {
    const navigate = useNavigate();

    const createProductSubmitHandler = async (e) => {
        e.preventDefault();

        const productData = Object.fromEntries(new FormData(e.currentTarget));

        try {
            await productService.create(productData);
            navigate("/products");
        } catch (err) {
            // To implement Error notification
            console.log(err);
        }


    }

    return (
        <>
            <Header
                pageName="Add Product"
            />
            <div className="container-fluid bg-light py-4">
                <div className="container bg-icon">
                    <form id={styles["create-page"]} onSubmit={createProductSubmitHandler}>
                        <div className="g-5">
                            <div className={styles["md-2"]}>
                                <label htmlFor="itemName" className="form-label">Name:</label>
                                <input type="text" id="itemName" name="name" aria-describedby="emailHelp" placeholder="Item name" autoComplete="true" />
                            </div>
                            <div className={styles["md-2"]}>
                                <label htmlFor="price" className="form-label">Price:</label>
                                <input type="text" id="price" name="price" placeholder="price" autoComplete="true" />
                            </div>
                            <div className={styles["md-2"]}>
                                <label htmlFor="image" className="form-label">Image Url:</label>
                                <input type="url" id="image" name="imageUrl" placeholder="image" autoComplete="true" />
                            </div>
                            <div className={styles["md-2"]}>
                                <label htmlFor="country" className="form-label">Country:</label>
                                <input type="text" id="country" name="country" placeholder="country" autoComplete="true" />
                            </div>
                            <div className={styles["md-2"]}>
                                <label htmlFor="kindProduct" className="form-label">Kind product:</label>
                                <select name="kindProduct">
                                    <option value="A">Fruit</option>
                                    <option value="B">Vegetable</option>
                                </select>
                            </div>
                            <div className={styles["md-2"]}>
                                <label htmlFor="quantity" className="form-label">Quantity in order:</label>
                                <input type="number" id="quantity" name="quantity" placeholder="quantity" autoComplete="true" />
                            </div>
                            <div className={styles["md-2"]}>
                                <label htmlFor="description" className="form-label">Description:</label>
                                <textarea className="form-group" id="description" name="description"></textarea>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary rounded-pill py-2 px-1">Add Product</button>
                    </form>
                </div>
            </div>

        </>
    );
}