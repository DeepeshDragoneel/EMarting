import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import "./EditProduct.scss";
import axios from "axios";
import NavBar from "../../../Components/NavBar/NavBar";
import { useParams } from "react-router";
import { NavLink } from "react-router-dom";
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

const EditProduct = (props) => {
    const [editProductInfo, seteditProductInfo] = useState(useParams());
    const [product, setproduct] = useState({});
    const [fileInputState, setfileInputState] = useState("");
    const [previewImage, setpreviewImage] = useState("");
    const [productDetails, setproductDetails] = useState({
        id: "",
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
            } else {
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
            } else {
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
            };
        }
        console.log(productDetails);
    };
    const addProductButton = useStyles();
    let temp;

    const getProductInfo = (editProductInfo) => {
        axios
            .get(`http://localhost:8000/admin/editProduct/${editProductInfo}`)
            .then((res) => {
                temp = res.data;
                console.log(temp);
                setproduct(temp);
                console.log(product);
                setproductDetails({
                    id: temp._id,
                    title: temp.title,
                    price: temp.price,
                    desc: temp.desc,
                    genre: temp.genre,
                    pages: temp.pages,
                    quantity: temp.quantity,
                    author: temp.author,
                });
            })
            .catch((error) => {
                console.log(error);
            });
        // const data = await res;
        // setproduct(data);
        // console.log(data);
        // console.log(product);
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
            return result.data._id;
        } catch (error) {
            console.log(error);
        }
    };

    const sendEditProductInfo = async () => {
        console.log("Product Info from Admin Edit Products:");
        console.log(productDetails);

        try {
            const result = await axios({
                method: "POST",
                url: "http://localhost:8000/admin/editProduct",
                headers: {
                    "content-type": "application/json",
                    accept: "application/json",
                },
                data: JSON.stringify({ data: productDetails }),
            });
            console.log(result);
        } catch (e) {
            console.log(e);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let data = new FormData();
        const detailes = {
            id: productDetails.id,
            title: productDetails.title,
            price: productDetails.price,
            desc: productDetails.desc,
            genre: productDetails.genre,
            pages: productDetails.pages,
            quantity: productDetails.quantity,
            author: productDetails.author,
        };
        data.append("data", JSON.stringify(detailes));
        data.append("file", productDetails.image);
        console.log(data);
        try {
            const token = localStorage.getItem("JWT");
            const id = await checkAuthorization(token);
            const result = await axios({
                method: "post",
                url: `http://localhost:8000/admin/editProduct`,
                data: data,
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
    };

    useEffect(() => {
        console.log(editProductInfo.id);
        getProductInfo(editProductInfo.id);
    }, []);

    return (
        <div>
            <h1>Edit Product:</h1>
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
                        value={productDetails.title}
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
                        value={productDetails.price}
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
                        value={productDetails.author}
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
                        value={productDetails.desc}
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
                    <NavLink
                        to="../shop"
                        style={{
                            textDecoration: "none",
                            fontSize: "inherit",
                            color: "inherit",
                        }}
                    >
                        Edit Product
                    </NavLink>
                </Button>
            </form>
        </div>
    );
};

export default EditProduct;
