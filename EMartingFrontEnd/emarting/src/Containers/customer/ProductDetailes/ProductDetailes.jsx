import axios from "axios";
import "./ProductDetailes.scss";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import "./ProductDetailes.scss";
import loading from "../../../assets/loading.gif";
import NavBar from "../../../Components/NavBar/NavBar";

const ProductDetailes = () => {
    const [productId, setproductId] = useState(useParams());
    const [product, setproduct] = useState({});
    const id = productId.id;
    const url = `http://localhost:8000/shop/detailes/${id}`;
    const getProductDetailes = () => {
        axios
            .get(url)
            .then((res) => {
                const temp = res.data;
                console.log(temp);
                setproduct(temp);
                console.log(product);
            })
            .catch((error) => {
                console.log(error);
            });
        // setproduct(temp.data);
        // t = ((temp.data));
        // console.log("t:")
        // console.log(t);
        // setproduct({
        //   ...product,
        //   data: {
        //     id: t.id,
        //     title: t.title,
        //     imageUrl: t.imageURL,
        //     desc : t.desc,
        //     price: t.price
        //   },
        // });
        // console.log("product.data:")
        // console.log(product.data)
        // console.log("product:")
        // console.log(product);
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
                        alignContent: "flex-start"
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
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        <br/>
        </div>
    );
};

export default ProductDetailes;
