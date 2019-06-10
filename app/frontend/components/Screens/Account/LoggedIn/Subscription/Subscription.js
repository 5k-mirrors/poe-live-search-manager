import React from "react";
import styled from "styled-components";
import DataDisplayer from "./DataDisplayer/DataDisplayer";
import * as customHooks from "../../../../../utils/CustomHooks/CustomHooks";
import subscription from "../../../../../../Subscription/Subscription";
import * as subscriptionActions from "../../../../../../Subscription/Actions";
import { refreshButton } from "./Subscription.style";

const StyledRefreshButton = styled.button`
  ${refreshButton}
`;

const subscriptionTest = ({ id }) => {
  const [fetchDetails, reFetch] = customHooks.useGenericFetch(
    subscription.getData,
    id
  );
  const [isDisabled, disableRefreshButton] = customHooks.useDisable(1);

  function onRefreshButtonClick() {
    reFetch();

    subscriptionActions.updateWebSocketConnections();

    disableRefreshButton();
  }

  return (
    <div>
      <h3>Subscription information</h3>
      <DataDisplayer fetchDetails={fetchDetails} />
      <StyledRefreshButton disabled={isDisabled} onClick={onRefreshButtonClick}>
        Refresh
      </StyledRefreshButton>
    </div>
  );
};

export default subscriptionTest;
