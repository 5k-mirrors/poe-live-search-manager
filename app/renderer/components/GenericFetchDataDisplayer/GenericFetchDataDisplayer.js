import React from "react";
import Loader from "../UI/Loader/Loader";

const genericFetchDataDisplayer = ({ fetchedData, children }) => {
  if (fetchedData.isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (fetchedData.err) {
    return <p>An error occurred while fetching data</p>;
  }

  return children;
};

export default genericFetchDataDisplayer;
