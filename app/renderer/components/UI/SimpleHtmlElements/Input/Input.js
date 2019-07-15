import React from "react";
import TextField from "@material-ui/core/TextField";
import { useInputStyles } from "./Input.style";

const input = ({ ...props }) => {
  const classes = useInputStyles();

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
        className: classes.input,
      }}
      {...props}
    />
  );
};

export default input;
