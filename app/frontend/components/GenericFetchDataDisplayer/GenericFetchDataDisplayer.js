import React from "react";
import LoaderIcon from "../UI/Icons/Loader/Loader";

const genericFetchDataDisplayer = ({ fetchedData, children }) => {
  if (fetchedData.isLoading) {
    return <LoaderIcon />;
  }

  if (fetchedData.err) {
    return <p>An error occurred while fetching data</p>;
  }

  return children;
};

export default genericFetchDataDisplayer;
