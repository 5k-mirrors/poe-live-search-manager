import React from "react";
import styled from "styled-components";
import { Items } from "./DataDisplayer.style";

const StyledItems = styled.div`
  ${Items}
`;

const dataDisplayer = ({ subscriptionData }) => (
  <StyledItems>
    <p>
      <b>Tier </b>
      {subscriptionData.active_subscription.tier}
    </p>
    <p>
      <b>Period </b>
      {subscriptionData.active_subscription.period}
    </p>
    <p>
      <b>Expires at </b>
      {subscriptionData.active_subscription.active_until}
    </p>
  </StyledItems>
);

export default dataDisplayer;
