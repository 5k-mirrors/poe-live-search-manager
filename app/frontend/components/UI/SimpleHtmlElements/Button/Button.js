import React from "react";
import Button from "@material-ui/core/Button";
import { useButtonStyles } from "./Button.style";

const button = ({ clickEvent, text, ...props }) => {
  const classes = useButtonStyles();

  return (
    <Button
      variant="contained"
      color="primary"
      size="medium"
      onClick={clickEvent}
      className={classes.button}
      {...props}
    >
      {text}
    </Button>
  );
};
export default button;
