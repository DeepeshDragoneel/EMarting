import axios from "axios";
import "./ProductDetailes.scss";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import "./ProductDetailes.scss";
import loading from "../../../assets/loading.gif";
import NavBar from "../../../Components/NavBar/NavBar";
import ProductReview from "./ProductReview/ProductReview";
import { Rating } from "@material-ui/lab";

const ProductDetailes = () => {
    const [productId, setproductId] = useState(useParams());
    const [product, setproduct] = useState({});
    const [ReviewBackDropOpen, setReviewBackDropOpen] = useState(false);
    const [rating, setrating] = useState(0);
    const [heading, setheading] = useState("");
    const [desc, setdesc] = useState("");
    const [userId, setuserId] = useState("");
    const [perRating, setperRating] = useState({});
    const id = productId.id;
    const url = `http://localhost:8000/shop/detailes/${id}`;
    function round(value, precision) {
        var multiplier = Math.pow(10, precision || 0);
        return Math.round(value * multiplier) / multiplier;
    }
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
            return result.data._id;
        } catch (error) {
            console.log(error);
        }
    };
    const getProductDetailes = async () => {
        const token = localStorage.getItem("JWT");
        const result = await checkAuthorization(token);
        setuserId(result);
        axios
            .get(url)
            .then((res) => {
                const temp = res.data;
                console.log(temp);
                setproduct(temp);
                console.log(product);
                setrating(temp.rating);
                console.log(rating);
                axios
                    .get(`http://localhost:8000/getRatingPerStar/${temp._id}`)
                    .then((res) => {
                        setperRating(res.data);
                        console.log(res);
                    })
                    .catch((error) => console.log(error));
            })
            .catch((error) => {
                console.log(error);
            });
    };
    const getperRating = async (productId) => {
        console.log("IN func");
        const starPerRating = await axios({
            method: "GET",
            url: "http://localhost:8000/getRatingPerStar",
        });
        return starPerRating;
    };
    useEffect(() => {
        console.log(url);
        getProductDetailes();
    }, []);
    return (
        <div>
            <h1
                style={{
                    margin: "2rem 0 2rem 0",
                }}
            >
                Product Details:
            </h1>
            {product === undefined ? (
                <img src={loading} alt="Loading"></img>
            ) : (
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        alignContent: "flex-start",
                    }}
                >
                    <div className="productDetailesProductImage">
                        <img
                            src={product.image}
                            className="productDetailesImage"
                            alt="Product"
                        ></img>
                    </div>
                    <div
                        style={{
                            alignContent: "start",
                            justifyContent: "start",
                            textAlign: "start",
                            width: "fit-content",
                            margin: "auto",
                            maxWidth: "65%",
                            wordWrap: "wrap",
                        }}
                    >
                        <h2>{product.title}</h2>
                        <h6>By: {product.author}</h6>
                        <div
                            className="ProductDetailsRatingDiv"
                            style={{ display: "flex", alignContent: "center" }}
                        >
                            <Rating readOnly value={rating} precision={0.1} />
                            <p style={{ marginLeft: "0.5rem" }}>
                                {round(rating, 1)}
                            </p>
                        </div>
                        <p>Product Id: {product._id}</p>
                        <h4>₹{product.price}</h4>
                        <p style={{}}>{product.desc}</p>
                        <div
                            style={{
                                marginTop: "3rem",
                                display: "flex",
                                width: "100%",

                                justifyContent: "space-evenly",
                            }}
                        >
                            <button type="button" class="btn btn-outline-dark">
                                Add To Cart 🛒
                            </button>
                            <button
                                type="button"
                                class="btn btn-outline-success"
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="productDetailesReviewsDiv">
                <div className="productDetailesReviewsDiv1">
                    <div className="productDetailesReviewsDiv1Rating">
                        <h1>Customers Reviews: </h1>
                        <div
                            className="ProductDetailsRatingDiv"
                            style={{
                                display: "flex",
                                alignContent: "baseline",
                            }}
                        >
                            <Rating
                                readOnly
                                value={rating}
                                precision={0.1}
                                style={{ marginTop: "0.3rem" }}
                            />
                            <p
                                style={{
                                    marginLeft: "0.5rem",
                                    fontSize: "1.3rem",
                                }}
                            >
                                {round(rating, 1)} out of 5
                            </p>
                        </div>
                        <div className="ratingPercentageDivPerRating">
                            <p>5 star</p>
                            <div className="ParentRatingPercentageDiv">
                                <div
                                    className="childRatingPercentageDiv"
                                    style={{
                                        width: `${perRating.five}%`,
                                        height: "100%",
                                    }}
                                >
                                </div>
                            </div>
                            {perRating.five}%
                        </div>
                        <div className="ratingPercentageDivPerRating">
                            <p>4 star</p>
                            <div className="ParentRatingPercentageDiv">
                                <div
                                    className="childRatingPercentageDiv"
                                    style={{
                                        width: `${perRating.four}%`,
                                        height: "100%",
                                    }}
                                >
                                </div>
                            </div>
                            {perRating.four}%
                        </div>
                        <div className="ratingPercentageDivPerRating">
                            <p>3 star</p>
                            <div className="ParentRatingPercentageDiv">
                                <div
                                    className="childRatingPercentageDiv"
                                    style={{
                                        width: `${perRating.three}%`,
                                        height: "100%",
                                    }}
                                >
                                </div>
                            </div>
                            {perRating.three}%
                        </div>
                        <div className="ratingPercentageDivPerRating">
                            <p>2 star</p>
                            <div className="ParentRatingPercentageDiv">
                                <div
                                    className="childRatingPercentageDiv"
                                    style={{
                                        width: `${perRating.two}%`,
                                        height: "100%",
                                    }}
                                >
                                </div>
                            </div>
                            {perRating.two}%
                        </div>
                        <div className="ratingPercentageDivPerRating">
                            <p>1 star</p>
                            <div className="ParentRatingPercentageDiv">
                                <div
                                    className="childRatingPercentageDiv"
                                    style={{
                                        width: `${perRating.one}%`,
                                        height: "100%",
                                    }}
                                >
                                </div>
                            </div>
                            {perRating.one}%
                        </div>
                    </div>
                    <h3>Review this product</h3>
                    <p>Share your thoughts with other customers</p>
                    <button
                        type="button"
                        class="btn btn-secondary"
                        onClick={() => {
                            setReviewBackDropOpen(true);
                        }}
                    >
                        Write a Review {">"}
                    </button>
                </div>
                <div className="productDetailesReviewsDiv2">
                    <h1>Reviews: </h1>
                </div>
            </div>
            {ReviewBackDropOpen ? (
                <ProductReview
                    product={product}
                    closeBackDrop={setReviewBackDropOpen}
                    userId={userId}
                />
            ) : null}
        </div>
    );
};

export default ProductDetailes;
