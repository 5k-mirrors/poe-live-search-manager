import React from "react";
import styled from "styled-components";
import LoaderIcon from "../../../../../UI/LoaderIcon/LoaderIcon";
import { Items } from "./DataDisplayer.style";

const StyledItems = styled.div`
  ${Items}
`;

const dataDisplayer = ({ subscriptionData }) => {
  if (subscriptionData.isLoading) {
    return <LoaderIcon />;
  }

  if (subscriptionData.err) {
    return <p>An error occurred while querying subcription information.</p>;
  }

  return (
    <StyledItems>
      <p>
        <b>Tier </b>
        {subscriptionData.data.active_subscription.tier}
      </p>
      <p>
        <b>Period </b>
        {subscriptionData.data.active_subscription.period}
      </p>
      <p>
        <b>Active until </b>
        {subscriptionData.data.active_subscription.active_until}
      </p>
    </StyledItems>
  );
};

export default dataDisplayer;
