import React from "react";
import Done from "@material-ui/icons/Done";
import Cancel from "@material-ui/icons/Cancel";

const connected = ({ ...props }) => {
  const { isConnected } = props;

  if (isConnected) {
    return <Done fontSize="large" />;
  }

  return <Cancel fontSize="large" />;
};

export default connected;
