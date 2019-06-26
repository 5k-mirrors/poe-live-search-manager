import React from "react";
import SuccessIcon from "../../UI/Icons/Success/Success";
import ErrorIcon from "../../UI/Icons/Error/Error";

const connected = ({ ...props }) => {
  const { isConnected } = props;

  if (isConnected) {
    return <SuccessIcon />;
  }

  return <ErrorIcon />;
};

export default connected;
