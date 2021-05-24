import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Review from '../Review';
import {Typography, Button, Divider} from '@material-ui/core';
import shopIcon from "../../../../../assets/icon.png";
import { useSelector, useDispatch } from "react-redux";

function loadRazorPay(src) {
  return new Promise(resolve => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    }
    script.onerror = () => {
      resolve(false);
    }
    document.body.appendChild(script);
  })
};

const PaymentForm = (props) => {

    const [userId, setuserId] = useState();
    const [totalPrice, settotalPrice] = useState(0);
    
    const [cartProducts, setcartProducts] = useState([]);

    function isDate(val) {
      // Cross realm comptatible
      return Object.prototype.toString.call(val) === "[object Date]";
    }

    function isObj(val) {
      return typeof val === "object";
    }

    function stringifyValue(val) {
      if (isObj(val) && !isDate(val)) {
        return JSON.stringify(val);
      } else {
        return val;
      }
    }

    function buildForm({ action, params }) {
      const form = document.createElement("form");
      form.setAttribute("method", "post");
      form.setAttribute("action", action);

      Object.keys(params).forEach((key) => {
        const input = document.createElement("input");
        input.setAttribute("type", "hidden");
        input.setAttribute("name", key);
        input.setAttribute("value", stringifyValue(params[key]));
        form.appendChild(input);
      });

      return form;
    }

    function post(details) {
      const form = buildForm(details);
      document.body.appendChild(form);
      form.submit();
      form.remove();
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
        setuserId(result.data._id);
        return result.data._id;
      } catch (error) {
        console.log(error);
      }
    };

    const getCartItems = async () => {
      try {
        const token = localStorage.getItem("JWT");
        if (token === null) {
          setcartProducts(null);
        } else {
          const id = await checkAuthorization(token);
          console.log("id: ", userId);
          const result = await axios.get(`http://localhost:8000/cart/${id}`);
          console.log("Result.data: ",result.data);
          setcartProducts(result.data);
          console.log("cartProducts: ",cartProducts);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const username = useSelector((state) => state.loggedIn.userName);

    const displayRazorPay = async() => {
      const token = localStorage.getItem("JWT");
      if (token === null) {
        return console.log("Please Login");
      }
      const res = await loadRazorPay("https://checkout.razorpay.com/v1/checkout.js");
      if(!res){
        alert("ERROR OCCURED WHILE CONNECTING TO PAYMENT GATEWAY!");
        return;
      }
      const id = await checkAuthorization(token);
      const result = await axios({
        method: "POST",
        url: "http://localhost:8000/order/razorpay",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
        },
        data: JSON.stringify({
          id: id,
          totalPrice: totalPrice,
        }),
      });
      console.log(result);
      const options = {
        key: "rzp_test_lYvwV7s3QyvsZv", //process.env.REACT_APP_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
        amount: result.data.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: result.data.currency,
        name: "EMarting",
        description: "The order will be placed after the Payment!",
        image: { shopIcon },
        order_id: result.data.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        handler: function (response) {
          /* alert(response.razorpay_payment_id);
          alert(response.razorpay_order_id);
          alert(response.razorpay_signature); */
          console.log(response);
          props.paymentSuccess();

        },
        prefill: {
          name: username,
          email: result.data.email
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#3399cc",
        },
      };
      var paymentObject = new window.Razorpay(options);
      paymentObject.open()
    }

    const postOrder = async() => {
        try{
            const token = localStorage.getItem("JWT");
            if(token === null){
                console.log("Please Login")
            }
            else{
                const id = await checkAuthorization(token);
                const result = await axios({
                    method: "POST",
                    url: "http://localhost:8000/cart/order",
                    headers: {
                        "content-type": "application/json",
                        accept: "application/json",
                    },
                    data: JSON.stringify({
                        id: id,
                        totalPrice: totalPrice
                    }),
                });
                console.log("Payment result: ",result);
                var information = {
                  action: "https://securegw-stage.paytm.in/order/process",
                  params: result.data,
                };
                post(information);
            }
        }
        catch(error){
            console.log(error);
        }
    }
    
    useEffect(() => {
      getCartItems();
    }, []);

    return (
      <div>
        <Review items={cartProducts} settotalPrice={settotalPrice} />
        <Divider />
        <Button variant="contained" color="primary" onClick={displayRazorPay}>
          Proceed to Pay
        </Button>
      </div>
    );
}

export default PaymentForm;
