import axios from "axios";
import './ProductDetailes.scss';
import React, { useState, useEffect } from "react";
import { useParams } from 'react-router';
import "./ProductDetailes.scss";
import loading from '../../../assets/loading.gif';
import NavBar from '../../../Components/NavBar/NavBar';


const ProductDetailes = () => {
    const [productId, setproductId] = useState(useParams());
    const [product, setproduct] = useState({});
    const id = productId.id;
    const url = `http://localhost:8000/shop/detailes/${id}`;
    const getProductDetailes = () => { 
            axios.get(url).then((res) => {
                const temp = res.data;
                console.log(temp);
                setproduct(temp);
                console.log(product);
            }).catch((error)=>{
                console.log(error);
            })
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
    }
    useEffect(() => {
        console.log(url);
        getProductDetailes();
    }, [])
    return (
      <div>
        <h1>Product Details:</h1>
        {product === undefined ? (
          <img src={loading} alt="Loading"></img>
        ) : (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
            }}
          >
            <img
              src={product.imageURL}
              className="productDetailesImage"
              alt="Product"
            ></img>
            <div
              style={{
                alignContent: "start",
                justifyContent: "start",
                textAlign: "start",
                width: "max-content",
                margin: "auto",
                minWidth: "30rem",
                maxWidth: "40%"
              }}
            >
              <h2>{product.title}</h2>
              <p>Product Id: {product._id}</p>
              <h4>₹{product.price}</h4>
              <p style={{
              }}>{product.desc}</p>
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
                <button type="button" class="btn btn-outline-success">
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
}

export default ProductDetailes;
