import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useLoaderStyles } from "./Loader.style";

const loader = () => {
  const classes = useLoaderStyles();

  return <CircularProgress className={classes.root} color="secondary" />;
};

export default loader;
