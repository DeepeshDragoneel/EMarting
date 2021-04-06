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
    const [errors, seterrors] = useState({
        errors: ""
    })
    const [formData, setformData] = useState("");
    const [info, setinfo] = useState({
        name: "",
        image: ""
    })
    const [productDetails, setproductDetails] = useState({
        title: "",
        price: "",
        desc: ""
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
        if(event.target.name == "imageFile"){
            setproductDetails({
              ...productDetails,
              image: event.target.files[0],
            });
            console.log("Event.target: ",event.target.files[0]);
        }
        console.log(productDetails);
    }
    const addProductButton = useStyles();

    const checkAuthorization = async(token) => {
      try {
        const result = await axios({
          method: "POST",
          url: "http://localhost:8000/auth",
          headers: {
            "content-type": "application/json",
            accept: "application/json",
          },
          data: JSON.stringify({
            "token": token
          })
        });
        console.log(result.data._id);
        return result.data._id;
      } catch (error) {
        console.log(error);
      }
    }

    const sendAddProductInfo = async(productInfo) => {
        console.log("Product Info from Admin add Products:")
        console.log(productInfo);
        try{
            const token = localStorage.getItem("JWT");
            const id = await checkAuthorization(token);
            const result = await axios({
              method: "POST",
              url: `http://localhost:8000/admin/addProduct/${id}`,
              headers: {
                "content-type": "application/json",
                accept: "application/json",
              },
              data: JSON.stringify({ productDetails }),
            });
            console.log(result);
        }
        catch(e){
            console.log(e);
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        let data = new FormData();
        const detailes = {
            title: productDetails.title,
            price: productDetails.price,
            desc: productDetails.desc,
        }
        data.append("data", JSON.stringify(detailes));
        data.append("file", productDetails.image);
        console.log(data);
        try {
            const token = localStorage.getItem("JWT");
            const id = await checkAuthorization(token);
            const result = await axios({
                method: "post",
                url: `http://localhost:8000/admin/addProduct/${id}`,
                data: data,
                headers: {
                    "content-type": "multipart/form-data",
                }
            });
            console.log(result.data);
            setproductDetails({
                title: "",
                price: "",
                desc: ""
            });
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <h1>Add Product:</h1>
            <form className="addProductForm" onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="formControl">
                    <label for="productTitle" className="addProductTags mr-auto" name= "title">Title:</label>
                    <input required type="text" id="productTitle" className="addProductInput" name="title" onChange={productDetailsHandler}></input>
                </div>
                <div className="formControl">
                    <label for="productImageFile" className="addProductTags" name= "imageURL">Image:</label>
                    <input required type="file" id="productImageFile" className="addProductInput" name="imageFile" onChange={productDetailsHandler}></input>
                </div>
                <div className="formControl">
                    <label for="productPrice" className="addProductTags" name= "price">Price:</label>
                    <input required type="text" id="productPrice" className="addProductInput" name="price" onChange={productDetailsHandler}></input>
                </div>    
                <div className="formControl">
                    <label for="productDesc" className="addProductTags" name= "desc">Description:</label>
                    <textarea type="text" id="productDesc" className="addProductInput" name="desc" onChange={productDetailsHandler}></textarea>
                </div>
                <Button variant="outlined" className={addProductButton.submitButton} type="submit"
                style={{
                    margin: "3rem"
                }}>
                    
                        Add Product
                </Button>
            </form>
        </div>
    )
}

export default AddProduct;
