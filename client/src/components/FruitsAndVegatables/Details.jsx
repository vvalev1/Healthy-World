import Header from "../Header";
import styles from "./Details.module.css"

export default function Details() {
    return (
        <>
            <Header
                pageName="Details"
            />
            {/* <section id = "services" classNameName="services section-bg" >
            <div classNameName="container">
                <div classNameName="row g-5 align-items-center">
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
                                    <span className="price">Price: $ 699.00</span>
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
        </section > */}

            <div className="container">
                <div className="card">
                    <div className="card-body">
                        <h3 className="card-title">Rounded Chair</h3>
                        <div className="row">
                            <div className="col-lg-5 col-md-5 col-sm-6">
                                <div className="white-box text-center"><img src="https://www.bootdey.com/image/430x600/00CED1/000000" className="img-responsive"/></div>
                            </div>
                            <div className="col-lg-7 col-md-7 col-sm-6">
                                <h4 className="box-title mt-5">Product description</h4>
                                <p>Lorem Ipsum available,but the majority have suffered alteration in some form,by injected humour,or randomised words which don't look even slightly believable.but the majority have suffered alteration in some form,by injected humour</p>
                                <h2 className="mt-5">$153</h2>
                                <button className="btn btn-dark btn-rounded mx-1">
                                    <i className="fa fa-shopping-cart"></i>
                                </button>
                                <button className="btn btn-primary">Buy Now</button>
                                <div className="mt-4">
                                    <button className="btn btn-secondary mx-2 px-4 rounded-pill">Edit</button>
                                    <button className="btn btn-danger rounded-pill px-4">Delete</button>
                                </div>
                                <h3 className="box-title mt-5">Key Highlights</h3>
                                <ul className="list-unstyled">
                                    <li><i className="fa fa-check text-success"></i>Sturdy structure</li>
                                    <li><i className="fa fa-check text-success"></i>Designed to foster easy portability</li>
                                    <li><i className="fa fa-check text-success"></i>Perfect furniture to flaunt your wonderful collectibles</li>
                                </ul>
                            </div>
                            <div className="col-lg-12 col-md-12 col-sm-12">
                                <h3 className="box-title mt-5">General Info</h3>
                                <div className="table-responsive">
                                    <table className="table table-striped table-product">
                                        <tbody>
                                            <tr>
                                                <td width="390">Brand</td>
                                                <td>Stellar</td>
                                            </tr>
                                            <tr>
                                                <td>Delivery Condition</td>
                                                <td>Knock Down</td>
                                            </tr>
                                            <tr>
                                                <td>Seat Lock Included</td>
                                                <td>Yes</td>
                                            </tr>
                                            <tr>
                                                <td>Type</td>
                                                <td>Office Chair</td>
                                            </tr>
                                            <tr>
                                                <td>Style</td>
                                                <td>Contemporary&amp;Modern</td>
                                            </tr>
                                            <tr>
                                                <td>Wheels Included</td>
                                                <td>Yes</td>
                                            </tr>
                                            <tr>
                                                <td>Upholstery Included</td>
                                                <td>Yes</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}