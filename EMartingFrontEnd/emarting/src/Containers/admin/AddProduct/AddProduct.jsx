import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import './AddProduct.scss';
import axios from 'axios';
import NavBar from '../../../Components/NavBar/NavBar';
import {NavLink} from 'react-router-dom';

const useStyles = makeStyles({
    submitButton: {
        backgroundColor: "#34eef6",
        color: "white",
        fontWeight: "600",
        "&:hover": {
            backgroundColor: "#c1fcff",
            color: "black",
        }
    } 
})

const AddProduct = (props) => {
    const [productDetails, setproductDetails] = useState({
        title: "",
        imageURL: "",
        price: "",
        description: ""
    });
    const productDetailsHandler = (event) =>{
        // console.log("hello");
        if(event.target.name == "title"){
            setproductDetails({
                    ...productDetails,
                    title: event.target.value
                }
            )
        }
        if(event.target.name == "imageURL"){
            setproductDetails({
                    ...productDetails,
                    imageURL: event.target.value
                }
            )
        }
        if(event.target.name == "desc"){
            setproductDetails({
                    ...productDetails,
                    desc: event.target.value
                }
            )
        }
        if(event.target.name == "price"){
            setproductDetails({
                    ...productDetails,
                    price: event.target.value
                }
            )
        }
        console.log(productDetails);
    }
    const addProductButton = useStyles();
    const sendAddProductInfo = async(productInfo) => {
        console.log("Product Info from Admin add Products:")
        console.log(productInfo);
        try{
            const result = await axios({
                method: "POST",
                url: "http://localhost:8000/admin/addProduct",
                headers:{
                    "content-type": "application/json",
                    "accept":"application/json"
                },
                data: JSON.stringify({"data": productInfo})
            })
            console.log(result);
        }
        catch(e){
            console.log(e);
        }
    }
    return (
        <div>
            <h1>Add Product:</h1>
            <form className="addProductForm" method="POST" action="http://localhost:8000/admin/addProduct">
                <div className="formControl">
                    <label for="productTitle" className="addProductTags mr-auto" name= "title">Title:</label>
                    <input required type="text" id="productTitle" className="addProductInput" name="title" onChange={productDetailsHandler}></input>
                </div>
                <div className="formControl">
                    <label for="productImage" className="addProductTags" name= "imageURL">ImageURL:</label>
                    <input required type="text" id="productImage" className="addProductInput" name="imageURL" onChange={productDetailsHandler}></input>
                </div>
                <div className="formControl">
                    <label for="productPrice" className="addProductTags" name= "price">Price:</label>
                    <input required type="text" id="productPrice" className="addProductInput" name="price" onChange={productDetailsHandler}></input>
                </div>    
                <div className="formControl">
                    <label for="productDesc" className="addProductTags" name= "desc">Description:</label>
                    <textarea type="text" id="productDesc" className="addProductInput" name="desc" onChange={productDetailsHandler}></textarea>
                </div>
                <Button variant="outlined" className={addProductButton.submitButton} type="submit" onClick={()=>sendAddProductInfo(productDetails)}
                style={{
                    margin: "3rem"
                }}>
                    <NavLink to="../shop" style={{
                            textDecoration: "none",
                            fontSize: "inherit",
                            color: "inherit"
                        }}>   
                        Add Product
                    </NavLink>
                </Button>
            </form>
        </div>
    )
}

export default AddProduct;
