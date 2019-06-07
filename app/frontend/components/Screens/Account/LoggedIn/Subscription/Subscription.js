import React from "react";
import styled from "styled-components";
import * as CustomHooks from "../../../../../utils/CustomHooks/CustomHooks";
import * as subscriptionUtils from "../../../../../../utils/SubscriptionUtils/SubscriptionUtils";
import DataDisplayer from "./DataDisplayer/DataDisplayer";
import { refreshButton } from "./Subscription.style";

const StyledRefreshButton = styled.button`
  ${refreshButton}
`;

// TODO: the data should also be refreshed here!
const subscription = ({ id }) => {
  const [
    subscriptionData,
    refreshSubscriptionData
  ] = CustomHooks.useGenericFetch(subscriptionUtils.get, id);
  const [isDisabled, disableRefreshButton] = CustomHooks.useDisable(1);

  function onRefreshButtonClick() {
    refreshSubscriptionData();

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

export default subscription;
