import React from "react";
import TextField from "@mui/material/TextField";
import { useInputStyles } from "./Input.style";

export default ({ ...props }) => {
  const classes = useInputStyles();
  const { InputProps, ...otherProps } = props;

  return (
    <TextField
      variant="outlined"
      InputLabelProps={{
        classes: {
          root: classes.label,
          focused: classes.focused,
        },
      }}
      InputProps={{
        ...InputProps,
        className: classes.input,
      }}
      {...otherProps}
    />
  );
};
