import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Orders.scss";
import { CgShoppingBag } from "react-icons/cg";
import CircularProgress from "@material-ui/core/CircularProgress";

const Orders = () => {
    const [orders, setorders] = useState([]);
    const [loading, setloading] = useState(true);
    const getOrders = async () => {
        const token = localStorage.getItem("JWT");
        const result = await axios({
            method: "GET",
            url: `${process.env.REACT_APP_REST_URL}getOrders`,
            params: { token: token },
        });
        console.log(result.data);
        setorders(result.data);
        setloading(false);
    };

    useEffect(() => {
        getOrders();
    }, []);
    return (
        <div className="OrdersMainDiv">
            <h1>You Orders!</h1>
            {loading ? (
                <CircularProgress />
            ) : (
                <div className="OrdersList">
                    {orders.length === 0 && orders !== undefined ? (
                        <div
                            style={{
                                verticalAlign: "center",
                                display: "flex",
                                justifyContent: "center",
                                alignContent: "center",
                            }}
                        >
                            <h1>No Orders Found</h1>
                            <CgShoppingBag style={{ fontSize: "5rem" }} />
                        </div>
                    ) : (
                        orders.map((item, idx) => {
                            return (
                                <div className="SingleOrderList" key={idx}>
                                    <h3>Order Id: {item._id}</h3>
                                    <h3>Products: </h3>
                                    <div className="OrderProductList">
                                        {item.products.map((product, idx) => (
                                            <ol>
                                                <li>
                                                    <ul>
                                                        <li>
                                                            Product Id:{" "}
                                                            {product._id}
                                                        </li>
                                                        <li>Quantity: {product.quantity}</li>
                                                    </ul>
                                                </li>
                                            </ol>
                                        ))}
                                    </div>
                                    <div className="OrderDeliveryLocation">
                                        <h3>Delivery Address:</h3>
                                        <p>{item.address} {item.city} {item.zipCode}</p>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};

export default Orders;
