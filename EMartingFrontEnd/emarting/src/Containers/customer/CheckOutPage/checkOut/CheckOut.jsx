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
        window.location.href.split("/")[4]
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

    const paymentSuccess = async () => {
        console.log("Payment Successfull!");
        const token = localStorage.getItem("JWT");
        const result = await axios({
            method: "POST",
            url: "http://localhost:8000/paymentSuccessFull",
            headers: {
                "content-type": "application/json",
                accept: "application/json",
            },
            data: JSON.stringify({ token: token, location: address }),
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
                productId={singleProduct}
            />
        ) : (
            <PaymentForm paymentSuccess={paymentSuccess} productId={null} />
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
