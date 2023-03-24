import React from "react";
import TextField from "@mui/material/TextField";
import { useInputStyles } from "./Input.style";

export default ({ ...props }) => {
  const classes = useInputStyles;
  const { InputProps, ...otherProps } = props;

  return (
    <TextField
      variant="outlined"
      InputLabelProps={{
        sx: {
          color: '#fff'
        }
      }}
      InputProps={{
        ...InputProps,
        style: classes.input,
      }}
      {...otherProps}
    />
  );
};
