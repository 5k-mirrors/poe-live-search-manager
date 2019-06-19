import React from "react";
import DataDisplayer from "./DataDisplayer/DataDisplayer";
import GenericFetchDataDisplayer from "../../../../GenericFetchDataDisplayer/GenericFetchDataDisplayer";
import * as customHooks from "../../../../../utils/CustomHooks/CustomHooks";
import subscription from "../../../../../../Subscription/Subscription";
import * as webSocketActions from "../../../../../../backend/web-sockets/actions";
import Button from "../../../../UI/Button/Button";

const subscriptionDetails = ({ id }) => {
  const [fetchedData, refreshFetchedData] = customHooks.useGenericFetch(
    subscription.getData,
    id
  );
  const [isDisabled, disableRefreshButton] = customHooks.useDisable(1);

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
      <Button
        clickEvent={onRefreshButtonClick}
        text="Refresh"
        disabled={isDisabled}
      />
    </div>
  );
};

export default subscriptionDetails;
