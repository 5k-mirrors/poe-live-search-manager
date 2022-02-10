import React from "react";
import Done from "@mui/icons-material/Done";
import Button from "@mui/material/Button";
import { useButtonWithSuccessIconStyles } from "./ButtonWithSuccessIcon.style";
import useTimeout from "../../../utils/useTimeout";

const ButtonWithSuccessIcon = ({ text, clickEventHandler }) => {
  const classes = useButtonWithSuccessIconStyles();
  const {
    isTimeout: isSuccessIconVisible,
    timeout: timeoutSuccessIcon,
  } = useTimeout();

  const onClick = () => {
    clickEventHandler().then(() => {
      timeoutSuccessIcon();
    });
  };

  return (
    <Button
      variant="contained"
      color="primary"
      size="medium"
      onClick={onClick}
      className={classes.button}
    >
      {text}
      {isSuccessIconVisible ? <Done className={classes.extendedIcon} /> : null}
    </Button>
  );
};

export default ButtonWithSuccessIcon;
