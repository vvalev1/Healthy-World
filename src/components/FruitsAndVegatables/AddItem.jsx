import Header from "../Header";
import styles from "./AddItem.module.css";
export default function AddItem() {
    return (
        <>
            <Header 
                pageName="Add Item"
            />
            <div className="container-fluid bg-light py-4">
                <div className="container">
                    <form>
                        <div className="g-5">
                            <div className="form-group">
                                <label htmlFor="itemName">Item name:</label>
                                <input type="text" id="itemName" name="itemName" aria-describedby="emailHelp" placeholder="Item name" autoComplete="true" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="price">Price:</label>
                                <input type="text" id="price" name="price" placeholder="price" autoComplete="true" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="image">Image Url:</label>
                                <input type="url" id="image" name="image" placeholder="image" autoComplete="true" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="country">Country:</label>
                                <input type="text" id="country" name="country" placeholder="country" autoComplete="true" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="quantity">Quantity in order:</label>
                                <input type="number" id="quantity" name="quantity" placeholder="quantity" autoComplete="true" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="nutrition">Nutrition:</label>
                                <input type="text" id="nutrition" name="nutrition" placeholder="nutrition" autoComplete="true" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="description">Description:</label>
                                <textarea className="form-group" id="description" name="description"></textarea>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary rounded-pill py-2">Add Item</button>
                    </form>
                </div>
            </div>
        </>
    );
}