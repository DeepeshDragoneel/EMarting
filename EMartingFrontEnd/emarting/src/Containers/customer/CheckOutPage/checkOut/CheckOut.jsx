import React, { useState } from 'react';
import {Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button} from '@material-ui/core';
import useStyles from  "./checkOut.js";
import AddressForm from './AddressForm/AddressForm';
import PaymentForm from './PaymentForm/PaymentForm';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";
import { successIcon } from "../../../../assets/successIcon.svg";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ConformationPage from './ConformationPage/ConformationPage';

const steps = ["Shipping Address", "Payment Details"];


const CheckOut = (props) => {
    const [activeStep, setactiveStep] = useState(0);

    const nextStep = () => {
      setactiveStep(step => step+1);
    }
    const prevStep = () => {
      setactiveStep(step => step-1);
    }
    
    const [address, setaddress] = useState();

    const completeAddress = async(data) => {
      const result = await setaddress(data);
      console.log(result);
      console.log("Checkout address: ", data, address);
      nextStep();
    }

    const paymentSuccess = () => {
      nextStep();
    }

    const classes = useStyles();

    const ConformationFrom = () => (
      <div>
        ConformationFrom
        <CircularProgress></CircularProgress>
      </div>
    );

    const Form = () =>
      activeStep === 0 ? (
        <AddressForm completeAddress={completeAddress} />
      ) : (
        <PaymentForm paymentSuccess={paymentSuccess} />
      );
    return (
      <>
        <div className={classes.toolbar} />
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Typography variant="h4" align="center">
              Checkout
            </Typography>
            <Stepper activeStep={activeStep} className={classes.stepper}>
              {steps.map((step) => (
                <Step key={step}>
                  <StepLabel>{step}</StepLabel>
                </Step>
              ))}
            </Stepper>
            {activeStep === steps.length ?<ConformationPage />:<Form /> }
          </Paper>
        </main>
      </>
    );
}

export default CheckOut;
