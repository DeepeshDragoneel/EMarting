import React from 'react';
import { InputLabel, Select, MenuItem, Button, Grid, Typography } from '@material-ui/core';
import { useForm, FormProvider} from 'react-hook-form';
import FormInput from "./CustomTextField";
import { Link } from 'react-router-dom';

const AddressForm = ({completeAddress}) => {
    const methods = useForm();

    return (
      <div>
        <Typography variant="h4" gutterBottom>
          Shipping Address
        </Typography>
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit((data) => {
              completeAddress(data);
          })}>
            <Grid container spacing={3}>
              <FormInput name="FirstName" label="First Name" required />
              <FormInput name="LastName" label="Last Name" required />
              <FormInput name="Address" label="Address" required />
              <FormInput name="PhoneNumber" label="Phone Number" required />
              <FormInput name="City" label="City" required />
              <FormInput name="ZIP" label="ZIP" required />
            </Grid>
            <br/>
            <div style={{display: "flex", justifyContent: "space-evenly"}}>
                <Button component={Link} to="/cart" variant="outlined">Back to Cart</Button>
                <Button type="Submit" variant="contained" color="primary">Proceed to Payment</Button>
            </div>
          </form>
        </FormProvider>
      </div>
    );
}

export default AddressForm;
