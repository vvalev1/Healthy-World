import { useState } from 'react';
import { useParams } from 'react-router-dom';

import useForm from '../hooks/useForm';
import * as orderService from '../../services/orderService'

import styles from './OrderForm.module.css';
import Header from '../Header';

export default function OrderForm() {
    const [errorMsg, setErrorMsg] = useState("");
    const [successfulOrder, setSuccessfulOrder] = useState("");
    const { productId } = useParams();

    const OrderFormKeys = {
        Name: "name",
        Address: "address",
        PhoneNumber: "phoneNumber"
    };

    const intialValues = {
        [OrderFormKeys.Name]: "",
        [OrderFormKeys.Address]: "",
        [OrderFormKeys.PhoneNumber]: "",
    }

    const { values, onChange, onSubmit } = useForm(sendOrderHandler, intialValues);

    function sendOrderHandler() {
        const { name, address, phoneNumber } = values;

        if (name === "") {
            return setErrorMsg("Name field is required!");
        }

        if (address === "") {
            return setErrorMsg("Address field is required!");
        }

        if (phoneNumber === "") {
            return setErrorMsg("Phone Number field is required!");
        }

        setErrorMsg("");
        orderService.create(productId, values)
            .then(setSuccessfulOrder("Thank you for your order!"))
            .catch((err) => console.log(err));

    }

    return (
        <>
            <Header pageName="Order" />

            <div className="container-fluid bg-light py-4">
                <div className="container">
                    {successfulOrder && (
                        <p id={styles["successfulOrder"]}>{successfulOrder}</p>
                    )}

                    {!successfulOrder && (
                        <form id={styles["search-page"]} onSubmit={onSubmit}>
                            <div className="g-5 align-items-center">
                                <p id={styles["errorMsg"]}>{errorMsg}</p>
                                <div className={styles["md-2"]}>
                                    <label htmlFor="name">Name:</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name={OrderFormKeys.Name}
                                        placeholder="Name"
                                        onChange={onChange}
                                        value={values[OrderFormKeys.Name]}
                                        autoComplete="true"
                                    />
                                </div>
                                <div className={styles["md-2"]}>
                                    <label htmlFor="address">Address:</label>
                                    <input
                                        type="text"
                                        id="address"
                                        name={OrderFormKeys.Address}
                                        placeholder="Address"
                                        onChange={onChange}
                                        value={values[OrderFormKeys.Address]}
                                        autoComplete="true"
                                    />
                                </div>
                                <div className={styles["md-2"]}>
                                    <label htmlFor="phoneNumber">Phone Number:</label>
                                    <input
                                        type="text"
                                        id="phoneNumber"
                                        name={OrderFormKeys.PhoneNumber}
                                        placeholder="Phone Number"
                                        onChange={onChange}
                                        value={values[OrderFormKeys.PhoneNumber]}
                                        autoComplete="true"
                                    />
                                </div>

                            </div>
                            <button type="submit" className="btn btn-primary rounded-pill py-2">Send</button>
                        </form>
                    )}

                </div>
            </div>
        </>

    )
} 