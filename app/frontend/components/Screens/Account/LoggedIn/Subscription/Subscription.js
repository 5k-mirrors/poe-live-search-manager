import React from "react";
import styled from "styled-components";
import DataDisplayer from "./DataDisplayer/DataDisplayer";
import * as CustomHooks from "../../../../../utils/CustomHooks/CustomHooks";
import subscription from "../../../../../../Subscription/Subscription";
import { refreshButton } from "./Subscription.style";

const StyledRefreshButton = styled.button`
  ${refreshButton}
`;

const subscriptionContainer = ({ id }) => {
  const [
    subscriptionData,
    refreshSubscriptionData
  ] = CustomHooks.useGenericFetch(subscription.getData, id);
  const [isDisabled, disableRefreshButton] = CustomHooks.useDisable(1);

  function onRefreshButtonClick() {
    refreshSubscriptionData();

    subscription.update(subscriptionData);

    disableRefreshButton();
  }

  return (
    <div>
      <h3>Subscription information</h3>
      <DataDisplayer subscriptionData={subscriptionData} />
      <StyledRefreshButton disabled={isDisabled} onClick={onRefreshButtonClick}>
        Refresh
      </StyledRefreshButton>
    </div>
  );
};

export default subscriptionContainer;
