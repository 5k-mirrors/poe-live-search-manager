import React from "react";
import Box from "@material-ui/core/Box";
import { useFlexBoxStyles } from "./FlexBox.style";

const flexBox = ({ ...props }) => {
  const classes = useFlexBoxStyles();

  const { children } = props;

  return (
    <Box
      className={classes.container}
      display="flex"
      alignItems="center"
      {...props}
    >
      {children}
    </Box>
  );
};

export default flexBox;
