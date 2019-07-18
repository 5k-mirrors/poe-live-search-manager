import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useGenericFetchDataDisplayerStyles } from "./GenericFetchDataDisplayer.style";

const genericFetchDataDisplayer = ({ fetchedData, children }) => {
  const classes = useGenericFetchDataDisplayerStyles();

  if (fetchedData.isLoading) {
    return (
      <div>
        <CircularProgress color="secondary" className={classes.loaderIcon} />
      </div>
    );
  }

  if (fetchedData.err) {
    return <p>An error occurred while fetching data</p>;
  }

  return children;
};

export default genericFetchDataDisplayer;
