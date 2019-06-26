import React from "react";
import IconDisplayer from "../UI/IconDisplayer/IconDisplayer";
import loaderIcon from "../../resources/assets/SVG/Loader.svg";

const genericFetchDataDisplayer = ({ fetchedData, children }) => {
  if (fetchedData.isLoading) {
    return <IconDisplayer path={loaderIcon} />;
  }

  if (fetchedData.err) {
    return <p>An error occurred while fetching data</p>;
  }

  return children;
};

export default genericFetchDataDisplayer;
