import React from "react";
import styled from "styled-components";
import LoaderIcon from "../../../../../UI/LoaderIcon/LoaderIcon";
import { Items } from "./DataDisplayer.style";

const StyledItems = styled.div`
  ${Items}
`;

const dataDisplayer = ({ fetchDetails }) => {
  if (fetchDetails.isLoading) {
    return <LoaderIcon />;
  }

  if (fetchDetails.err) {
    return <p>An error occurred while querying subcription information.</p>;
  }

  return (
    <StyledItems>
      <p>
        <b>Tier </b>
        {fetchDetails.data.active_subscription.tier}
      </p>
      <p>
        <b>Period </b>
        {fetchDetails.data.active_subscription.period}
      </p>
      <p>
        <b>Active until </b>
        {fetchDetails.data.active_subscription.active_until}
      </p>
    </StyledItems>
  );
};

export default dataDisplayer;
