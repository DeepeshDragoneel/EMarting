import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { TextField, Grid } from "@material-ui/core";

const FormInput = (props) => {
  const { control } = useFormContext();
  const isError = false;

  return (
    <Grid item xs={12} sm={6}>
      <Controller
        render={({ field }) => <TextField {...field} label={props.label} required={props.required}/>}
        name={props.name}
        control={control}
        label="{props.label}"
        fullWidth
      />
    </Grid>
  );
}

export default FormInput;
