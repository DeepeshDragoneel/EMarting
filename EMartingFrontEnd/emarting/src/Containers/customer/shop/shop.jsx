import React, { useState, useEffect, useRef, useCallback } from "react";
import "./shop.scss";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import { NavLink, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { incrementCartNotification } from "../../../redux/CartNotifications/CartNotificationsActions";
import SearchBar from "../../../Components/SeachBar/SeachBar";
import SearchHook from "../../../hooks/SearchHook";
import {
    logoutUser,
    loginUser,
} from "../../../redux/LoginLogoutFeatues/LoginLogoutFeaturesActions";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles({
    root: {
        // width: "100rem !important",
        width: "20rem !important",
        wordWrap: "break-word",
    },
    media: {
        height: 140,
    },
});

const Shop = () => {

    const classes = useStyles();

    const history = useHistory();
    const [query, setquery] = useState("");
    const [pageNumber, setpageNumber] = useState(1);
    const { loading, error, hasMore, Products } = SearchHook(
        query,
        pageNumber
    );
    const lastBookRef = useRef();
    const lastBookElement = useCallback(book => {
      if (loading) return;
      console.log("BOOK: ", book);
      if (lastBookRef.current) {
        console.log("Disconnected");
        lastBookRef.current.disconnect();
      }
      lastBookRef.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore>0) {
          console.log("visible");
          setpageNumber(pageNumber => pageNumber + 1);
        }
      })
      if (book) {
        lastBookRef.current.observe(book);
        console.log(book);
      }
    }, [loading, hasMore]);

    const routeChange = () => {
        let path = `../login`;
        history.push(path);
    };

    const orderSingleItem = (item) => {
        console.log("ORDERING SINGLE ITEM");
        let path = `../order/${item._id}`
        history.push(path);
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
            return result.data._id;
        } catch (error) {
            console.log(error);
        }
    };

    /* const getProducts = async () => {
        try {
            console.log("GETTING PRODUCTS");
            const temp = await axios.get(`${process.env.REACT_APP_REST_URL}shop/`, {
                params: { query: "", pageNumber: 1 },
            });
            console.log(temp.data);
            setProducts(temp.data.products);
        } catch (error) {
            console.log(error);
        }
    }; */

    const addToCartProduct = async (product) => {
        try {
            const token = localStorage.getItem("JWT");
            const id = await checkAuthorization(token);
            console.log(id);
            const result = await axios({
                method: "post",
                url: `${process.env.REACT_APP_REST_URL}cart/${id}`,
                headers: {
                    "content-type": "application/json",
                    accept: "application/json",
                },
                data: JSON.stringify({ product: product }),
            });
            console.log("Result in addCart shop");
            console.log(result.data);
        } catch (e) {
            console.log(e);
        }
    };
    //cartNotifications Redux
    const cartNotificationDispatch = useDispatch();

    const userLoggedIn = useSelector((state) => state.loggedIn.loggedIn);

    useEffect(() => {
        cartNotificationDispatch(loginUser());
        // getProducts();
    }, []);

    return (
        <>
            <div
                style={{
                    padding: "1rem",
                }}
            >
                <h1>Products:</h1>
                <br />
                <br />
                <SearchBar onChange={setquery} changePage={setpageNumber} />
                <div
                    className="productPlace"
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "space-around",
                        alignItems: "flex-start",
                        alignContent: "space-between",
                    }}
                >
                    {Products.length === 0 && Products !== undefined ? (
                        <h1>No products Found</h1>
                    ) : (
                        Products.map((item, idx) => {
                            if (Products.length === idx + 1) {
                                return (
                                    <Card
                                        key={idx}
                                        className={classes.root}
                                        style={{
                                            margin: "2rem 0rem",
                                        }}
                                        ref={lastBookElement}
                                    >
                                        <NavLink
                                            to={`/shop/detailes/${item._id}`}
                                            style={{
                                                textDecoration: "none",
                                                color: "inherit",
                                                cursor: "pointer !important",
                                            }}
                                        >
                                            <CardActionArea>
                                                <CardMedia
                                                    className={classes.media}
                                                    image={item.image}
                                                    title={item.title}
                                                />
                                                <CardContent>
                                                    <Typography
                                                        gutterBottom
                                                        variant="h5"
                                                        component="h2"
                                                    >
                                                        {item.title}
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        color="textSecondary"
                                                        component="p"
                                                        style={{}}
                                                    >
                                                        {item.desc.length > 300
                                                            ? (item.desc =
                                                                  item.desc
                                                                      .substr(
                                                                          0,
                                                                          300
                                                                      )
                                                                      .concat(
                                                                          "..."
                                                                      ))
                                                            : item.desc}
                                                    </Typography>
                                                    <Typography
                                                        gutterBottom
                                                        variant="h5"
                                                        component="h2"
                                                    >
                                                        ₹{item.price}
                                                    </Typography>
                                                </CardContent>
                                            </CardActionArea>
                                        </NavLink>
                                        {item.quantity === 0 ? null : (
                                        <CardActions
                                            style={{
                                                display: "flex",
                                                justifyContent: "space-evenly",
                                            }}
                                            >
                                            <button
                                                type="button"
                                                class="btn btn-outline-dark"
                                                onClick={() => {
                                                    if (userLoggedIn === true) {
                                                        addToCartProduct(item);
                                                        cartNotificationDispatch(
                                                            incrementCartNotification()
                                                        );
                                                    } else {
                                                        routeChange();
                                                    }
                                                }}
                                            >
                                                Add To Cart 🛒
                                            </button>
                                            <button
                                                type="button"
                                                class="btn btn-outline-success"
                                                onClick={() => {
                                                    if (userLoggedIn === true) {
                                                        orderSingleItem(item);
                                                    } else {
                                                        routeChange();
                                                    }
                                                }}
                                            >
                                                Buy Now
                                            </button>
                                        </CardActions>
                                        )}
                                    </Card>
                                );
                            } else {
                                return (
                                    <Card
                                        key={idx}
                                        className={classes.root}
                                        style={{
                                            margin: "2rem 0rem",
                                        }}
                                    >
                                        <NavLink
                                            to={`/shop/detailes/${item._id}`}
                                            style={{
                                                textDecoration: "none",
                                                color: "inherit",
                                                cursor: "pointer !important",
                                            }}
                                        >
                                            <CardActionArea>
                                                <CardMedia
                                                    className={classes.media}
                                                    image={item.image}
                                                    title={item.title}
                                                />
                                                <CardContent>
                                                    <Typography
                                                        gutterBottom
                                                        variant="h5"
                                                        component="h2"
                                                    >
                                                        {item.title}
                                                    </Typography>
                                                    <Typography
                                                        variant="body2"
                                                        color="textSecondary"
                                                        component="p"
                                                        style={{}}
                                                    >
                                                        {item.desc.length > 300
                                                            ? (item.desc =
                                                                  item.desc
                                                                      .substr(
                                                                          0,
                                                                          300
                                                                      )
                                                                      .concat(
                                                                          "..."
                                                                      ))
                                                            : item.desc}
                                                    </Typography>
                                                    <Typography
                                                        gutterBottom
                                                        variant="h5"
                                                        component="h2"
                                                    >
                                                        ₹{item.price}
                                                    </Typography>
                                                </CardContent>
                                            </CardActionArea>
                                        </NavLink>
                                        {item.quantity === 0 ? null : (
                                            <CardActions
                                                style={{
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-evenly",
                                                }}
                                            >
                                                <button
                                                    type="button"
                                                    class="btn btn-outline-dark"
                                                    onClick={() => {
                                                        if (
                                                            userLoggedIn ===
                                                            true
                                                        ) {
                                                            addToCartProduct(
                                                                item
                                                            );
                                                            cartNotificationDispatch(
                                                                incrementCartNotification()
                                                            );
                                                        } else {
                                                            routeChange();
                                                        }
                                                    }}
                                                >
                                                    Add To Cart 🛒
                                                </button>
                                                <button
                                                    type="button"
                                                    class="btn btn-outline-success"
                                                    onClick={() => {
                                                        if (
                                                            userLoggedIn ===
                                                            true
                                                        ) {
                                                            orderSingleItem(
                                                                item
                                                            );
                                                        } else {
                                                            routeChange();
                                                        }
                                                    }}
                                                >
                                                    Buy Now
                                                </button>
                                            </CardActions>
                                        )}
                                    </Card>
                                );
                            }
                        })
                    )}
                </div>
                {loading ? (
                    <div>
                        <CircularProgress />
                    </div>
                ) : null}
            </div>
        </>
    );
};

export default Shop;
