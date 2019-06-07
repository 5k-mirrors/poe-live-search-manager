import React from "react";
import styled from "styled-components";
import * as CustomHooks from "../../../../../utils/CustomHooks/CustomHooks";
import baseApiUrl from "../../../../../resources/BaseApiUrl/BaseApiUrl";
import DataDisplayer from "./DataDisplayer/DataDisplayer";
import { refreshButton } from "./Subscription.style";

const StyledRefreshButton = styled.button`
  ${refreshButton}
`;

function getSubscriptionData(id) {
  const userApiUrl = `${baseApiUrl}/user/${id}`;

  return fetch(userApiUrl)
    .then(userSubscriptionDetails => userSubscriptionDetails.json())
    .then(parsedSubscriptionDetails => parsedSubscriptionDetails);
}

const subscription = ({ id }) => {
  const [subscriptionData, refreshData] = CustomHooks.useGenericFetch(
    getSubscriptionData,
    id
  );
  const [isDisabled, disableRefreshButton] = CustomHooks.useDisable(1);

  function onRefreshButtonClick() {
    refreshData();

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
