import React from "react";
import Done from "@material-ui/icons/Done";
import Button from "@material-ui/core/Button";
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
