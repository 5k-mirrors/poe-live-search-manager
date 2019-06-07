import React from "react";
import styled from "styled-components";
import * as customHooks from "../../../../../utils/CustomHooks/CustomHooks";
import DataDisplayer from "./DataDisplayer/DataDisplayer";
import { refreshButton } from "./Subscription.style";
import subscription from "../../../../../../Subscription/Subscription";

const StyledRefreshButton = styled.button`
  ${refreshButton}
`;

// TODO: the data should also be refreshed here!
const subscriptionTest = ({ id }) => {
  /* const [
    subscriptionData,
    refreshSubscriptionData
  ] = CustomHooks.useGenericFetch(subscriptionUtils.get, id); */
  const [isDisabled, disableRefreshButton] = customHooks.useDisable(1);

  function onRefreshButtonClick() {
    // refreshSubscriptionData();
    subscription.refresh(id);

    disableRefreshButton();
  }
  // <DataDisplayer subscriptionData={data} />
  return (
    <div>
      <h3>Subscription information</h3>
      <StyledRefreshButton disabled={isDisabled} onClick={onRefreshButtonClick}>
        Refresh
      </StyledRefreshButton>
    </div>
  );
};

export default subscriptionTest;
