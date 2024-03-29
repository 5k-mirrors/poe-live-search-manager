import React from "react";
import Done from "@mui/icons-material/Done";
import Cancel from "@mui/icons-material/Cancel";

const connected = ({ ...props }) => {
  const { isConnected } = props;

  if (isConnected) {
    return <Done fontSize="large" />;
  }

  return <Cancel fontSize="large" />;
};

export default connected;
