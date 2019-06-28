import React from "react";
import TextField from "@material-ui/core/TextField";
import { useInputStyles } from "./Input.style";

const input = ({ ...props }) => {
  const classes = useInputStyles();

  return (
    <TextField
      InputProps={{ classes, disableUnderline: true }}
      {...props}
      variant="filled"
    />
  );
};

export default input;
