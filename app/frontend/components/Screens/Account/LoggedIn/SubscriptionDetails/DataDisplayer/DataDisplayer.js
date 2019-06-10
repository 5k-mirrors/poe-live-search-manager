import React from "react";
import styled from "styled-components";
import LoaderIcon from "../../../../../UI/LoaderIcon/LoaderIcon";
import { Items } from "./DataDisplayer.style";

const StyledItems = styled.div`
  ${Items}
`;

const dataDisplayer = ({ fetchedData }) => {
  if (fetchedData.isLoading) {
    return <LoaderIcon />;
  }

  if (fetchedData.err) {
    return <p>An error occurred while querying subcription information.</p>;
  }

  return (
    <StyledItems>
      <p>
        <b>Tier </b>
        {fetchedData.data.active_subscription.tier}
      </p>
      <p>
        <b>Period </b>
        {fetchedData.data.active_subscription.period}
      </p>
      <p>
        <b>Active until </b>
        {fetchedData.data.active_subscription.active_until}
      </p>
    </StyledItems>
  );
};

export default dataDisplayer;
