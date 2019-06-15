import React from "react";
import firebase from "firebase/app";
import styled from "styled-components";
import DataDisplayer from "./DataDisplayer/DataDisplayer";
import GenericFetchDataDisplayer from "../../../../GenericFetchDataDisplayer/GenericFetchDataDisplayer";
import * as customHooks from "../../../../../utils/CustomHooks/CustomHooks";
import subscription from "../../../../../../Subscription/Subscription";
import * as webSocketActions from "../../../../../../backend/web-sockets/actions";
import { refreshButton } from "./SubscriptionDetails.style";

const StyledRefreshButton = styled.button`
  ${refreshButton}
`;

const subscriptionDetails = () => {
  const { currentUser } = firebase.auth();

  const [fetchedData, refreshFetchedData] = customHooks.useGenericFetch(
    subscription.getData,
    currentUser.uid
  );
  const [isDisabled, disableRefreshButton] = customHooks.useDisable(1000);

  function onRefreshButtonClick() {
    refreshFetchedData();

    webSocketActions.updateConnections();

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
