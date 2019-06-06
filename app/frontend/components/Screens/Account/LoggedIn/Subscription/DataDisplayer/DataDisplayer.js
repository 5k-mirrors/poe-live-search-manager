import React from "react";
import styled from "styled-components";
import { Items } from "./DataDisplayer.style";

const StyledItems = styled.div`
  ${Items}
`;

const dataDisplayer = ({ data }) => (
  <div>
    <h3>Subscription information</h3>
    <StyledItems>
      <p>
        <b>Tier </b>
        {data.active_subscription.tier}
      </p>
      <p>
        <b>Period </b>
        {data.active_subscription.period}
      </p>
      <p>
        <b>Active until </b>
        {data.active_subscription.active_until}
      </p>
    </StyledItems>
  </div>
);

export default dataDisplayer;
