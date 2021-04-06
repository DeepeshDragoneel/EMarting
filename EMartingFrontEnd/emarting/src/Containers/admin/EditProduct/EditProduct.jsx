import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import './EditProduct.scss';
import axios from 'axios';
import NavBar from '../../../Components/NavBar/NavBar';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';

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

const EditProduct = (props) => {
    const [editProductInfo, seteditProductInfo] = useState(useParams());
    const [product, setproduct] = useState({});
    const [productDetails, setproductDetails] = useState({
        id: "",
        title: "",
        price: "",
        desc: "",
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
        if(event.target.name == "imageFile"){
            setproductDetails({
                    ...productDetails,
                    image: event.target.files[0]
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
    let temp;

    const getProductInfo = (editProductInfo) => {
            axios
              .get(`http://localhost:8000/admin/editProduct/${editProductInfo}`)
              .then((res) => {
                temp = (res.data);
                console.log(temp);
                setproduct(temp);
                console.log(product);
                setproductDetails({
                    id: temp._id,
                    title: temp.title,
                    price: temp.price,
                    desc: temp.desc,
                })
              })
              .catch((error) => {
                console.log(error);
              });
            // const data = await res;
            // setproduct(data);
            // console.log(data);
            // console.log(product);
    }

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

    const sendEditProductInfo = async() => {
        console.log("Product Info from Admin Edit Products:");
        console.log(productDetails);

        try{
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
            id: productDetails.id,
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
                desc: ""
            });
        }
        catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        console.log(editProductInfo.id);
        getProductInfo(editProductInfo.id);
    }, [])

    return (
        <div>
            <h1>Edit Product:</h1>
            <form className="addProductForm" onSubmit={handleSubmit} encType="multipart/form-data">
                <div className="formControl">
                    <label for="productTitle" className="addProductTags mr-auto" name= "title">Title:</label>
                    <input type="text" id="productTitle" className="addProductInput" name="title" value={
                        productDetails.title
                    } onChange={productDetailsHandler}></input>
                </div>
                <div className="formControl">
                    <label for="productImageFile" className="addProductTags" name= "imageFile">Image:</label>
                    <input required type="file" id="productImageFile" className="addProductInput" name="imageFile" onChange={productDetailsHandler}></input>
                </div>
                <div className="formControl">
                    <label for="productPrice" className="addProductTags" name= "price">Price:</label>
                    <input type="text" id="productPrice" className="addProductInput" name="price" value={
                        productDetails.price
                    } onChange={productDetailsHandler}></input>
                </div>    
                <div className="formControl">
                    <label for="productDesc" className="addProductTags" name= "desc">Description:</label>
                    <textarea type="text" id="productDesc" className="addProductInput" name="desc" value={
                        productDetails.desc
                    } onChange={productDetailsHandler}></textarea>
                </div>
                <Button variant="outlined" className={addProductButton.submitButton} type="submit"
                style={{
                    margin: "3rem"
                }}>
                    {/* <NavLink to="../shop" style={{
                        textDecoration: "none",
                        fontSize: "inherit",
                        color: "inherit"
                    }}>
                    </NavLink> */}
                    Edit Product    
                </Button>
            </form>
        </div>
    )
}

export default EditProduct;
