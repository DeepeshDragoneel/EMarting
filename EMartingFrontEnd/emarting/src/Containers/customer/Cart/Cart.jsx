import React, {useEffect, useState} from 'react';
import './Cart.scss';
import NavBar from '../../../Components/NavBar/NavBar';
import axios from 'axios';
import { Link } from "react-router-dom";
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
    marginLeft: "4rem"
  },
}));

const Cart = () => {
    const classes = useStyles();
    const [deleteOptionClicked, setdeleteOptionClicked] = useState(false);
    const [cartQuantity, setcartQuantity] = useState();
    const [cartProducts, setcartProducts] = useState([]);
    console.log(cartProducts);

    const orderCartItems = async() => {
      try{
        const result = await axios({
          method: "POST",
          url: "http://localhost:8000/cart/order",
          headers: {
            "content-type": "application/json",
            accept: "application/json",
          },
        });
        console.log(result);
      }
      catch(error){
        console.log(error);
      }
    }

    const deleteCartItem = async(item) =>{
        try{
            const result = await axios({
                method: "POST",
                url: "http://localhost:8000/cart/delete",
                headers:{
                    "content-type": "application/json",
                    "accept":"application/json"
                },
                data: JSON.stringify({"data": item})
            })
            console.log(result);
            setdeleteOptionClicked((p) => {
              return !p;
            });
        }
        catch(error){
            console.log(error);
        }
    }

    const getCartItems = async() =>{
        try{
            const result = await axios.get("http://localhost:8000/cart");
            console.log(result.data);
            setcartProducts(result.data);
            console.log(cartProducts);
        }
        catch(error){
            console.log(error);
        }
    }

    const cartQuantityHandler = (event) => {
        console.log(event.target);
        setcartQuantity(event.target.value);
        console.log(event.target.value);
        console.log(cartQuantity);
    }

    useEffect(() => {
        getCartItems();
    }, [deleteOptionClicked])
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
          {cartProducts.length === 0 ? (
            <h1>Your EMarting cart is Empty!</h1>
          ) : (
            cartProducts.map((ele) => (
              <div className="cartProductDetailesTotal">
                <Link to={`/shop/detailes/${ele.productId._id}`}>
                  <img src={ele.productId.imageURL} alt="product"></img>
                </Link>
                <div className="cartProductDetailes">
                  <div className="cartProductTitlePrice">
                    <Link
                      to={`/shop/detailes/${ele.productId.id}`}
                      className="cartProductTitleLink"
                    >
                      <h4 className="cartProductTitle">
                        {ele.productId.title}
                      </h4>
                    </Link>
                    <div className="cartProductPrice">
                      <h4>₹{ele.productId.price * ele.quantity}</h4>
                    </div>
                  </div>
                  <div className="cartProductDetiales2">
                    <FormControl className={classes.formControl}>
                      <InputLabel shrink htmlFor="age-native-label-placeholder">
                        Quantity
                      </InputLabel>
                      <NativeSelect
                        value={cartQuantity}
                        onChange={cartQuantityHandler}
                        inputProps={{
                          name: "age",
                          id: "age-native-label-placeholder",
                        }}
                      >
                        <option value="">None</option>
                        <option value={10}>Ten</option>
                        <option value={20}>Twenty</option>
                        <option value={30}>Thirty</option>
                      </NativeSelect>
                      <FormHelperText>Change Quantity</FormHelperText>
                    </FormControl>
                    <Button
                      variant="contained"
                      color="secondary"
                      className={classes.button}
                      startIcon={<DeleteIcon />}
                      onClick={() => {
                        deleteCartItem(ele.productId);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <Button onClick={
          () => {
            orderCartItems();
          }
        }>Order</Button>
      </div>
    );
}

export default Cart;
