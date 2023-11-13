import Header from "../Header";
import styles from "./Details.module.css"

export default function Details() {
    return (
    <>
        <Header
                pageName="Details"
        />
        <section id = "services" className="services section-bg" >
            <div className="container">
                <div className="row g-5 align-items-center">
                    <div className="col-lg-6 wow fadeIn">
                        <div className="position-relative overflow-hidden">                            
                            <img className="img-fluid w-100" src="https://ucarecdn.com/382a5139-6712-4418-b25e-cc8ba69ab07f/-/stretch/off/-/resize/760x/" alt=""/>
                        </div>
                    </div>
                    <div className="col-lg-6 wow fadeIn">
                        <div className="_product-detail-content">
                            <h2 className="mb-4"> Milton Bottle </h2>
                            <div className="_p-price-box">
                                <div className="p-list">
                                    <span> M.R.P. : <i className="fa fa-inr"></i> <del> 1399  </del>   </span>
                                    <span className="price"> Rs. 699 </span>
                                </div>
                                <div className="_p-add-cart">
                                    <div className="_p-qty">
                                        <span>Add Quantity:</span>
                                        <span className="btn btn-primary py-1 mx-1" id="" value="Decrease Value">-</span>
                                        <input className ="" type="number" name="qty" id="number" value="1" readOnly={true} />
                                        <span className="btn btn-primary py-1 mx-1" id="" value="Increase Value">+</span>
                                    </div>
                                </div>
                                <div className="_p-features">
                                    <span> Description About this product:- </span>
                                Solid color polyester/linen full blackout thick sunscreen floor curtain
                                Type: General Pleat
                                Applicable Window Type: Flat Window
                                Format: Rope
                                Opening and Closing Method: Left and Right Biparting Open
                                Processing Accessories Cost: Included
                                Installation Type: Built-in
                                Function: High Shading(70%-90%)
                                Material: Polyester / Cotton
                                Style: ClassNameic
                                Pattern: Embroidered
                                Location: Window
                                Technics: Woven
                                Use: Home, Hotel, Hospital, Cafe, Office
                                Feature: Blackout, Insulated, Flame Retardant
                                Place of Origin: India
                                Name: Curtain
                                Usage: Window Decoration
                                Keywords: Ready Made Blackout Curtain
                                </div>
                                <button className="btn btn-primary rounded-pill px-4 me-md-4">
                                    <i className="fa fa-shopping-cart"></i> Buy Now
                                </button>
                                <button className="btn btn-secondary rounded-pill px-3">
                                    <i className="fa fa-shopping-cart"></i> Add to Cart
                                </button>
                                <div className="my-4">
                                    <button className="btn btn-warning rounded-pill px-4 mx-4">Edit</button>
                                    <button className="btn btn-danger rounded-pill px-4">Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section >
    </>
);
}