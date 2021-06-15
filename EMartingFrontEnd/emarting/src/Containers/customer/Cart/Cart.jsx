import React, { useEffect, useState } from "react";
import "./Cart.scss";
import NavBar from "../../../Components/NavBar/NavBar";
import axios from "axios";
import { Link, useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import NativeSelect from "@material-ui/core/NativeSelect";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
    button: {
        backgroundColor: "#fb3a3a",
        maxHeight: "2.5rem",
        marginLeft: "4rem",
    },
}));

const Cart = () => {
    const [isAuthorized, setisAuthorized] = useState(false);
    const [userId, setuserId] = useState();
    const classes = useStyles();
    const [deleteOptionClicked, setdeleteOptionClicked] = useState(false);
    const [cartQuantity, setcartQuantity] = useState();
    const [cartProducts, setcartProducts] = useState([]);
  let totalPrice = 0;
    console.log(cartProducts);

    const history = useHistory();
    const routeChange = () => {
        let path = `../order`;
        history.push(path);
    };

    const checkAuthorization = async (token) => {
        try {
            const result = await axios({
                method: "POST",
                url: "http://localhost:8000/auth",
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
    const sendUserData = async (id) => {
        try {
            const result = await axios({
                method: "POST",
                url: "http://localhost:8000/UserAuth",
                headers: {
                    "content-type": "application/json",
                    accept: "application/json",
                },
                data: JSON.stringify({
                    userId: id,
                }),
            });
            console.log(result.data._id);
            setuserId(result.data._id);
        } catch (error) {
            console.log(error);
        }
    };

    const orderCartItems = async () => {
        try {
            const result = await axios({
                method: "POST",
                url: "http://localhost:8000/cart/order",
                headers: {
                    "content-type": "application/json",
                    accept: "application/json",
                },
            });
            console.log(result);
        } catch (error) {
            console.log(error);
        }
    };

    const deleteCartItem = async (item) => {
        try {
            const token = localStorage.getItem("JWT");
            const id = await checkAuthorization(token);
            const result = await axios({
                method: "POST",
                url: `http://localhost:8000/cart/delete/${id}`,
                headers: {
                    "content-type": "application/json",
                    accept: "application/json",
                },
                data: JSON.stringify({ data: item }),
            });
            console.log(result);
            setdeleteOptionClicked((p) => {
                return !p;
            });
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
                const id = await checkAuthorization(token);
                console.log("useeffect: ", id);
                const result = await axios.get(
                    `http://localhost:8000/cart/${id}`
                );
                console.log(result.data);
                setcartProducts(result.data);
                console.log(cartProducts);
            }
        } catch (error) {
            console.log(error);
        }
  };

    const cartQuantityHandler = (event) => {
        console.log(event.target);
        setcartQuantity(event.target.value);
        console.log(event.target.value);
        console.log(cartQuantity);
    };

    useEffect(() => {
        getCartItems();
    }, [deleteOptionClicked]);
    return (
        <div>
            <div
                className="cartTitle"
                style={{
                    maxWidth: "fit-content",
                    margin: "2rem auto auto 2rem",
                }}
            >
                <h1 style={{}}>Your Cart:</h1>
            </div>
            <div
                className="cartProductsList"
                style={{
                    border: "1px solid black",
                    borderRadius: "10px",
                    margin: "1rem 1rem 1rem 1rem",
                }}
            >
                {cartProducts !== null ? (
                    cartProducts.length === 0 ? (
                        <h1>Your EMarting cart is Empty!</h1>
                    ) : (
                        <>
                            {cartProducts.map((ele) => {
                                totalPrice =
                                    totalPrice +
                                    ele.productId.price * ele.quantity;
                                return (
                                    <>
                                        <div className="cartProductDetailesTotal">
                                            {ele.productId !== null ? (
                                                <>
                                                    <Link
                                                        to={`/shop/detailes/${ele.productId._id}`}
                                                    >
                                                        <div className="cartImageDiv">
                                                            <img
                                                                src={
                                                                    ele
                                                                        .productId
                                                                        .image
                                                                }
                                                                alt="product"
                                                            ></img>
                                                        </div>
                                                    </Link>
                                                    <div className="cartProductDetailes">
                                                        <div className="cartProductTitlePrice">
                                                            <Link
                                                                to={`/shop/detailes/${ele.productId.id}`}
                                                                className="cartProductTitleLink"
                                                            >
                                                                <h4 className="cartProductTitle">
                                                                    {
                                                                        ele
                                                                            .productId
                                                                            .title
                                                                    }
                                                                </h4>
                                                            </Link>

                                                            <div className="cartProductPrice">
                                                                <h4>
                                                                    ₹
                                                                    {ele
                                                                        .productId
                                                                        .price *
                                                                        ele.quantity}
                                                                </h4>
                                                            </div>
                                                        </div>
                                                        <h2
                                                            style={{
                                                                fontSize:
                                                                    "1.2rem",
                                                                alignSelf:
                                                                    "start",
                                                                marginLeft:
                                                                    "2.2rem",
                                                                marginBottom:
                                                                    "1rem",
                                                            }}
                                                        >
                                                            Genre
                                                        </h2>
                                                        <div className="cartProductDetiales2">
                                                            <p>
                                                                Quantity:
                                                                {ele.quantity}
                                                            </p>
                                                            <Button
                                                                variant="contained"
                                                                color="secondary"
                                                                className={
                                                                    classes.button
                                                                }
                                                                startIcon={
                                                                    <DeleteIcon />
                                                                }
                                                                onClick={() => {
                                                                    deleteCartItem(
                                                                        ele.productId
                                                                    );
                                                                }}
                                                            >
                                                                Delete
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                "Yo"
                                            )}
                                        </div>
                                        <hr />
                                    </>
                                );
                            })}
                            <div
                                className="cartTotalPriceDiv"
                                style={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "flex-end",
                                }}
                            >
                                <h1
                                    style={{
                                        alignSelf: "end",
                                        margin: "1rem",
                                        fontSize: "1.5rem",
                                    }}
                                >
                                    Total: {totalPrice}
                                </h1>
                            </div>

                            <button
                                type="button"
                                    className="btn btn-success m-3"
                                    style={{
                                        width: "10rem"
                                    }}
                                onClick={() => {
                                    orderCartItems();
                                    routeChange();
                                }}
                            >
                                Order
                            </button>
                        </>
                    )
                ) : (
                    <h1>Login to your Account to Access Cart</h1>
                )}
            </div>
        </div>
    );
};

export default Cart;
