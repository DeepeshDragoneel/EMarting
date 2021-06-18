import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import "./AddProduct.scss";
import axios from "axios";
import NavBar from "../../../Components/NavBar/NavBar";
import { NavLink, useHistory } from "react-router-dom";
import SelectFinder from "../../../Components/SelectFinder/SelectFinder";
import bookGenre from "../../../assets/bookGenre.json";

const useStyles = makeStyles({
    submitButton: {
        backgroundColor: "#34eef6",
        color: "white",
        fontWeight: "600",
        "&:hover": {
            backgroundColor: "#c1fcff",
            color: "black",
        },
    },
});

const AddProduct = (props) => {
    const [fileInputState, setfileInputState] = useState("");
    const [previewImage, setpreviewImage] = useState("");
    const history = useHistory();
    const routeChange = () => {
        let path = `/admin/shop`;
        history.push(path);
    };
    const [errors, seterrors] = useState({
        errors: "",
    });
    const [formData, setformData] = useState("");
    const [info, setinfo] = useState({
        name: "",
        image: "",
    });
    const [productDetails, setproductDetails] = useState({
        title: "",
        price: "",
        desc: "",
        genre: null,
        author: "",
        quantity: 0,
        pages: 0,
    });
    const productDetailsHandler = (event) => {
        // console.log("hello");
        if (event.target.name == "title") {
            setproductDetails({
                ...productDetails,
                title: event.target.value,
            });
        }
        if (event.target.name == "author") {
            setproductDetails({
                ...productDetails,
                author: event.target.value,
            });
        }
        if (event.target.name == "desc") {
            setproductDetails({
                ...productDetails,
                desc: event.target.value,
            });
        }
        if (event.target.name == "price") {
            setproductDetails({
                ...productDetails,
                price: event.target.value,
            });
        }
        if (event.target.name == "pages") {
            if (event.target.value < 0) {
                setproductDetails({
                    ...productDetails,
                    pages: 0,
                });
            }
            else {
                setproductDetails({
                    ...productDetails,
                    pages: event.target.value,
                });
            }
        }
        if (event.target.name == "quantity") {
            if (event.target.value < 0) {
                setproductDetails({
                    ...productDetails,
                    quantity: 0,
                });
            }
            else {
                setproductDetails({
                    ...productDetails,
                    quantity: event.target.value,
                });
            }
        }
        if (event.target.name == "imageFile") {
            setproductDetails({
                ...productDetails,
                image: event.target.files[0],
            });
            setfileInputState(event.target.files[0]);
            console.log("Event.target: ", event.target.files[0]);
            const reader = new FileReader();
            reader.readAsDataURL(event.target.files[0]);
            reader.onloadend = () => {
                setpreviewImage(reader.result);
            }
        }
        console.log(productDetails);
    };
    const addProductButton = useStyles();

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

    /* const sendAddProductInfo = async (productInfo) => {
        console.log("Product Info from Admin add Products:");
        console.log(productInfo);
        try {
            const token = localStorage.getItem("JWT");
            const id = await checkAuthorization(token);
            const result = await axios({
                method: "POST",
                url: `${process.env.REACT_APP_REST_URL}admin/addProduct/${id}`,
                headers: {
                    "content-type": "application/json",
                    accept: "application/json",
                },
                data: JSON.stringify({ productDetails }),
            });
            console.log(result);
        } catch (e) {
            console.log(e);
        }
    }; */

    const handleSubmit = async (e) => {
        e.preventDefault();
        let formData = new FormData();
        const detailes = {
            title: productDetails.title,
            price: productDetails.price,
            desc: productDetails.desc,
            genre: productDetails.genre,
            pages: productDetails.pages,
            quantity: productDetails.quantity,
            author: productDetails.author,
        };

        formData.append("data", JSON.stringify(detailes));
        formData.append("file", productDetails.image);
        // formData.append("upload_preset", "irffzxsz");

        if (fileInputState) {
            // console.log(previewImage);
        }
        
        console.log("handle submit data: ", formData);
        
        try {
            const token = localStorage.getItem("JWT");
            const id = await checkAuthorization(token);
            const result = await axios({
                method: "post",
                url: `${process.env.REACT_APP_REST_URL}admin/addProduct/${id}`,
                data: formData,
                headers: {
                    "content-type": "multipart/form-data",
                },
            });
            console.log(result.data);
            setproductDetails({
                title: "",
                price: "",
                desc: "",
                genre: null,
                author: "",
                quantity: 0,
                pages: 0,
            });
        } catch (error) {
            console.log(error);
        }
        routeChange();
    };

    return (
        <div>
            <h1>Add Product:</h1>
            <form
                className="addProductForm"
                onSubmit={handleSubmit}
                encType="multipart/form-data"
            >
                <div className="formControl">
                    <label
                        for="productTitle"
                        className="addProductTags mr-auto"
                        name="title"
                    >
                        Title:
                    </label>
                    <input
                        required
                        type="text"
                        id="productTitle"
                        className="addProductInput"
                        name="title"
                        onChange={productDetailsHandler}
                    ></input>
                </div>
                <div className="formControl">
                    <label
                        for="productImageFile"
                        className="addProductTags"
                        name="imageURL"
                    >
                        Image:
                    </label>
                    <input
                        required
                        type="file"
                        id="productImageFile"
                        className="addProductInput"
                        name="imageFile"
                        onChange={productDetailsHandler}
                    ></input>
                </div>
                {previewImage && (
                    <div>
                        <p>Preview:</p>
                        <img
                            src={previewImage}
                            alt="preview"
                            style={{
                                height: "300px",
                            }}
                        ></img>
                    </div>
                )}
                <div className="formControl">
                    <label for="genre" className="addProductTags" name="genre">
                        Genre:
                    </label>
                    <SelectFinder
                        required
                        types={bookGenre}
                        Statement="Select the Genre "
                        value={productDetails.genre}
                        name="genre"
                        onChange={setproductDetails}
                    ></SelectFinder>
                </div>
                <div className="formControl">
                    <label
                        for="productPrice"
                        className="addProductTags"
                        name="price"
                    >
                        Price:
                    </label>
                    <input
                        required
                        type="number"
                        id="productPrice"
                        className="addProductInput"
                        name="price"
                        onChange={productDetailsHandler}
                    ></input>
                </div>
                <div className="formControl">
                    <label for="pages" className="addProductTags" name="pages">
                        Pages:
                    </label>
                    <input
                        required
                        type="number"
                        id="pages"
                        className="addProductInput"
                        name="pages"
                        value={productDetails.pages}
                        onChange={productDetailsHandler}
                    ></input>
                </div>
                <div className="formControl">
                    <label
                        for="quantity"
                        className="addProductTags"
                        name="quantity"
                    >
                        Quantity:
                    </label>
                    <input
                        required
                        type="number"
                        id="quantity"
                        className="addProductInput"
                        name="quantity"
                        value={productDetails.quantity}
                        onChange={productDetailsHandler}
                    ></input>
                </div>
                <div className="formControl">
                    <label
                        for="author"
                        className="addProductTags"
                        name="author"
                    >
                        Author:
                    </label>
                    <input
                        required
                        type="text"
                        id="author"
                        className="addProductInput"
                        name="author"
                        onChange={productDetailsHandler}
                    ></input>
                </div>
                <div className="formControl">
                    <label
                        for="productDesc"
                        className="addProductTags"
                        name="desc"
                    >
                        Description:
                    </label>
                    <textarea
                        type="text"
                        id="productDesc"
                        className="addProductInput"
                        name="desc"
                        onChange={productDetailsHandler}
                    ></textarea>
                </div>

                <Button
                    variant="outlined"
                    className={addProductButton.submitButton}
                    type="submit"
                    style={{
                        margin: "3rem",
                    }}
                >
                    Add Product
                </Button>
            </form>
        </div>
    );
};

export default AddProduct;
