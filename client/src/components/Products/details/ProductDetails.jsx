import { Link } from "react-router-dom";

import Header from "../../Header";
import styles from "./ProductDetails.module.css"
import Path from "../../../paths/paths";

export default function Details() {
    return (
        <>
            <Header
                pageName="Product Details"
            />
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
                                    <Link to={Path.EditProduct} className="btn btn-secondary mx-2 px-4 rounded-pill">Edit</Link>
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