import React, { useState } from "react";
import {
    Paper,
    Stepper,
    Step,
    StepLabel,
    Typography,
    CircularProgress,
    Divider,
    Button,
} from "@material-ui/core";
import useStyles from "./checkOut.js";
import AddressForm from "./AddressForm/AddressForm";
import PaymentForm from "./PaymentForm/PaymentForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";
import { successIcon } from "../../../../assets/successIcon.svg";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ConformationPage from "./ConformationPage/ConformationPage";
import axios from "axios";

const steps = ["Shipping Address", "Payment Details"];

const CheckOut = (props) => {
    const [singleProduct, setsingleProduct] = useState(
        window.location.href.split("/")[6]
    );
    const [activeStep, setactiveStep] = useState(0);

    const nextStep = () => {
        setactiveStep((step) => step + 1);
    };
    const prevStep = () => {
        setactiveStep((step) => step - 1);
    };

    const [address, setaddress] = useState();

    const completeAddress = async (data) => {
        const result = await setaddress(data);
        console.log(result);
        console.log("Checkout address: ", data, address);
        nextStep();
    };

    const beforePayment = async (productId) => {
        try {
            const token = localStorage.getItem("JWT");
            console.log(productId);
            const result = await axios({
                method: "POST",
                url: `${process.env.REACT_APP_REST_URL}order/beforePayment`,
                headers: {
                    "content-type": "application/json",
                    accept: "application/json",
                },
                data: JSON.stringify({ token: token, productId: productId }),
            });
            console.log(result.data);
            if (result.data.status === "ERROR") {
                alert(result.data.msg);
            }
        }
        catch(error){
            console.log(error);
        }
    }

    const paymentSuccess = async (productId) => {
        console.log("Payment Successfull!");
        const token = localStorage.getItem("JWT");
        const result = await axios({
            method: "POST",
            url: `${process.env.REACT_APP_REST_URL}paymentSuccessFull`,
            headers: {
                "content-type": "application/json",
                accept: "application/json",
            },
            data: JSON.stringify({
                token: token,
                location: address,
                productId: productId,
            }),
        });
        console.log(result);
        nextStep();
    };

    const classes = useStyles();

    const ConformationFrom = () => (
        <div>
            Conformation From
            <CircularProgress></CircularProgress>
        </div>
    );

    const Form = () =>
        activeStep === 0 ? (
            <AddressForm completeAddress={completeAddress} />
        ) : singleProduct !== "" ? (
            <PaymentForm
                paymentSuccess={paymentSuccess}
                beforePayment={beforePayment}
                productId={singleProduct}
            />
        ) : (
            <PaymentForm
                paymentSuccess={paymentSuccess}
                beforePayment={beforePayment}
                productId={null}
            />
        );
    return (
        <>
            <div className={classes.toolbar} />
            <main className={classes.layout}>
                <Paper className={classes.paper}>
                    <Typography variant="h4" align="center">
                        Checkout
                    </Typography>
                    <Stepper
                        activeStep={activeStep}
                        className={classes.stepper}
                    >
                        {steps.map((step) => (
                            <Step key={step}>
                                <StepLabel>{step}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep === steps.length ? (
                        <ConformationPage />
                    ) : (
                        <Form />
                    )}
                </Paper>
            </main>
        </>
    );
};

export default CheckOut;
