import React from "react";
import SuccessIcon from "../../UI/Icons/Success/Success";
import ErrorIcon from "../../UI/Icons/Error/Error";
import * as javaScriptUtils from "../../../../utils/JavaScriptUtils/JavaScriptUtils";

const connected = ({ ...props }) => {
  if (!javaScriptUtils.isDefined(props)) {
    return <ErrorIcon />;
  }

  const { isConnected } = props;

  if (isConnected) {
    return <SuccessIcon />;
  }

  return <ErrorIcon />;
};

export default connected;
