import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { useLoaderStyles } from "./Loader.style";

export default () => {
  const classes = useLoaderStyles();

  return <CircularProgress className={classes.root} color="secondary" />;
};
