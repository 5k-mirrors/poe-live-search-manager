import React from "react";
import Done from "@mui/icons-material/Done";
import Button from "@mui/material/Button";
import { useButtonWithSuccessIconStyles } from "./ButtonWithSuccessIcon.style";

export default ({ iconIsVisible, text, clickEvent }) => {
  const classes = useButtonWithSuccessIconStyles();

  return (
    <Button
      variant="contained"
      color="primary"
      size="medium"
      onClick={clickEvent}
      className={classes.button}
    >
      {text}
      {iconIsVisible ? <Done className={classes.extendedIcon} /> : null}
    </Button>
  );
};
