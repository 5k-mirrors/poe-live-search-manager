import React from "react";
import styled from "styled-components";
import DataDisplayer from "./DataDisplayer/DataDisplayer";
import GenericFetchDataDisplayer from "../../../../GenericFetchDataDisplayer/GenericFetchDataDisplayer";
import * as customHooks from "../../../../../utils/CustomHooks/CustomHooks";
import subscription from "../../../../../../Subscription/Subscription";
import * as subscriptionActions from "../../../../../../Subscription/Actions";
import { refreshButton } from "./SubscriptionDetails.style";

const StyledRefreshButton = styled.button`
  ${refreshButton}
`;

const subscriptionDetails = ({ id }) => {
  const [fetchedData, refreshFetchedData] = customHooks.useGenericFetch(
    subscription.getData,
    id
  );
  const [isDisabled, disableRefreshButton] = customHooks.useDisable(1);

  function onRefreshButtonClick() {
    refreshFetchedData();

    subscriptionActions.updateWebSocketConnections();

    disableRefreshButton();
  }

  return (
    <div>
      <h3>Subscription information</h3>
      <GenericFetchDataDisplayer fetchedData={fetchedData}>
        <DataDisplayer subscriptionData={fetchedData.data} />
      </GenericFetchDataDisplayer>
      <StyledRefreshButton disabled={isDisabled} onClick={onRefreshButtonClick}>
        Refresh
      </StyledRefreshButton>
    </div>
  );
};

export default subscriptionDetails;
