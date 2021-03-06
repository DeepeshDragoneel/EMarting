import axios from "axios";
import React, { useEffect, useState } from "react";
import Review from "../Review";
import { Typography, Button, Divider } from "@material-ui/core";
import shopIcon from "../../../../../assets/icon.png";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

function loadRazorPay(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
}

const PaymentForm = (props) => {
    const [userId, setuserId] = useState();
    const [totalPrice, settotalPrice] = useState(0);
    const h = useHistory();
    const [cartProducts, setcartProducts] = useState([]);

    function isDate(val) {
        // Cross realm comptatible
        return Object.prototype.toString.call(val) === "[object Date]";
    }

    function isObj(val) {
        return typeof val === "object";
    }

    function stringifyValue(val) {
        if (isObj(val) && !isDate(val)) {
            return JSON.stringify(val);
        } else {
            return val;
        }
    }

    function buildForm({ action, params }) {
        const form = document.createElement("form");
        form.setAttribute("method", "post");
        form.setAttribute("action", action);

        Object.keys(params).forEach((key) => {
            const input = document.createElement("input");
            input.setAttribute("type", "hidden");
            input.setAttribute("name", key);
            input.setAttribute("value", stringifyValue(params[key]));
            form.appendChild(input);
        });

        return form;
    }

    function post(details) {
        const form = buildForm(details);
        document.body.appendChild(form);
        form.submit();
        form.remove();
    }

    const checkAuthorization = async (token) => {
        try {
            const result = await axios({
                method: "POST",
                url: `${process.env.REACT_APP_REST_URL}auth`,
                headers: {
                    "content-type": "application/json",
                    accept: "application/json",
                },
                data: JSON.stringify({
                    token: token,
                }),
            });
            console.log(result.data._id);
            setuserId(result.data._id);
            return result.data._id;
        } catch (error) {
            console.log(error);
        }
    };

    const getCartItems = async () => {
        try {
            const token = localStorage.getItem("JWT");
            if (token === null) {
                setcartProducts(null);
            } else {
                console.log("GETTING cart PRODUCTS!");
                const id = await checkAuthorization(token);
                console.log("id: ", userId);
                const result = await axios.get(
                    `${process.env.REACT_APP_REST_URL}cart/${id}`
                );
                console.log("Result.data: ", result.data);
                setcartProducts(result.data);
                console.log("cartProducts: ", cartProducts);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const username = useSelector((state) => state.loggedIn.userName);

    const displayRazorPay = async () => {
        const token = localStorage.getItem("JWT");
        if (token === null) {
            return console.log("Please Login");
        }
        const res = await loadRazorPay(
            "https://checkout.razorpay.com/v1/checkout.js"
        );
        if (!res) {
            alert("ERROR OCCURED WHILE CONNECTING TO PAYMENT GATEWAY!");
            return;
        }
        const id = await checkAuthorization(token);
        const result = await axios({
            method: "POST",
            url: `${process.env.REACT_APP_REST_URL}order/razorpay`,
            headers: {
                "content-type": "application/json",
                accept: "application/json",
            },
            data: JSON.stringify({
                id: id,
                totalPrice: totalPrice,
            }),
        });
        console.log("displayRazorPay: ", result);
        const options = {
            key: `${process.env.REACT_APP_RAZORPAY_KEY_ID}`, //process.env.REACT_APP_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
            amount: result.data.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            currency: result.data.currency,
            name: "EMarting",
            description:
                "(This is In test mode, money won't we deducted in real!)",
            image: { shopIcon },
            order_id: result.data.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
            handler: function (response) {
                /* alert(response.razorpay_payment_id);
                alert(response.razorpay_order_id);
                alert(response.razorpay_signature); */
                console.log(response);
                props.paymentSuccess(props.productId);
            },
            prefill: {
                name: username,
                email: result.data.email,
            },
            notes: {
                address: "Razorpay Corporate Office",
            },
            theme: {
                color: "#3399cc",
            },
        };
        var paymentObject = new window.Razorpay(options);
        paymentObject.on("payment.failed", function (response) {
            if (props.productId === undefined) {
                paymentObject.close();
                alert("Payment failed redirecting to shop!");
                paymentFailed();
                h.push("../shop");
            } else {
                paymentObject.close();
                paymentFailed();
                alert("Payment failed redirecting to shop!");
                h.push("../../shop");
            }
        });
        paymentObject.open();
    };

    const paymentFailed = async () => {
        try {
            const token = localStorage.getItem("JWT");
            console.log("PAYMENT FAILED!");
            const res = axios({
                method: "POST",
                url: `${process.env.REACT_APP_REST_URL}cart/orderFailed`,
                headers: {
                    "content-type": "application/json",
                    accept: "application/json",
                },
                data: JSON.stringify({
                    productId: props.productId,
                    token: token,
                }),
            });
            console.log(res);
        } catch (error) {
            console.log(error);
        }
    };

    const postOrder = async () => {
        try {
            const token = localStorage.getItem("JWT");
            if (token === null) {
                console.log("Please Login");
            } else {
                const id = await checkAuthorization(token);
                const result = await axios({
                    method: "POST",
                    url: `${process.env.REACT_APP_REST_URL}cart/order`,
                    headers: {
                        "content-type": "application/json",
                        accept: "application/json",
                    },
                    data: JSON.stringify({
                        id: id,
                        totalPrice: totalPrice,
                    }),
                });
                console.log("Payment result: ", result);
                var information = {
                    action: "https://securegw-stage.paytm.in/order/process",
                    params: result.data,
                };
                post(information);
            }
        } catch (error) {
            console.log(error);
        }
    };
    const getSingleProduct = async (productid) => {
        try {
            const token = localStorage.getItem("JWT");
            if (token === null) {
                setcartProducts(null);
            } else {
                const result = await axios.get(
                    `${process.env.REACT_APP_REST_URL}shop/detailes/${productid}`
                );
                console.log("Result.data: ", result.data);
                const item = [
                    {
                        productId: result.data,
                        quantity: 1,
                    },
                ];
                setcartProducts(item);
                console.log("cartProducts: ", cartProducts);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const beforePayment = async () => {
        props.beforePayment(props.productId);
        displayRazorPay();
    };

    const getProduct = async () => {
        console.log("props.productId: ", props.productId);
        if (props.productId === undefined) {
            getCartItems();
        } else {
            getSingleProduct(props.productId);
        }
    };

    useEffect(() => {
        getProduct();
    }, []);

    return (
        <div>
            <Review items={cartProducts} settotalPrice={settotalPrice} />
            <Divider />
            <Button variant="contained" color="primary" onClick={beforePayment}>
                Proceed to Pay
            </Button>
        </div>
    );
};

export default PaymentForm;
