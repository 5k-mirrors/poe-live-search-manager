import React from "react";
import TextField from "@material-ui/core/TextField";
import { useInputStyles } from "./Input.style";

const input = ({ ...props }) => {
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

export default input;
