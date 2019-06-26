import React from "react";
import IconDisplayer from "../../UI/IconDisplayer/IconDisplayer";
import successIcon from "../../../resources/assets/PNG/success.png";
import errorIcon from "../../../resources/assets/PNG/error.png";

const connected = ({ ...props }) => {
  const { isConnected } = props;

  if (isConnected) {
    return <IconDisplayer path={successIcon} />;
  }

  return <IconDisplayer path={errorIcon} />;
};

export default connected;
