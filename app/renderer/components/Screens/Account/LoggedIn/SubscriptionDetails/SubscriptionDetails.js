import React from "react";
import Box from "@material-ui/core/Box";
import * as customHooks from "../../../../../utils/CustomHooks/CustomHooks";
import subscription from "../../../../../../Subscription/Subscription";
import * as webSocketActions from "../../../../../../main/web-sockets/actions";
import Button from "../../../../UI/SimpleHtmlElements/Button/Button";
import Input from "../../../../UI/SimpleHtmlElements/Input/Input";
import * as firebaseUtils from "../../../../../utils/FirebaseUtils/FirebaseUtils";

const subscriptionDetails = () => {
  const firebaseContext = firebaseUtils.useFirebaseContext();

  const [fetchedData, refreshFetchedData] = customHooks.useGenericFetch(
    subscription.query,
    firebaseContext.currentUser.uid
  );
  const [isDisabled, disableRefreshButton] = customHooks.useDisable(1);

  function onRefreshButtonClick() {
    refreshFetchedData();

    webSocketActions.updateConnections();

    disableRefreshButton();
  }

  function subscriptionText() {
    if (fetchedData.isLoading) {
      return "Loading...";
    }
    if (fetchedData.err || !fetchedData.data) {
      return "Error while fetching data";
    }
    if (fetchedData.data.paying) {
      return fetchedData.data.type ? fetchedData.data.type : "Active";
    }
    return "Inactive";
  }

  return (
    <Box mt={3}>
      <Input
        type="text"
        value={subscriptionText()}
        label="Subscription"
        error={
          fetchedData.isLoading ||
          fetchedData.err ||
          (fetchedData.data && !fetchedData.data.paying)
        }
        InputProps={{
          readOnly: true,
        }}
      />
      <Box mt={3}>
        <Button
          clickEvent={onRefreshButtonClick}
          text="Refresh"
          disabled={isDisabled}
        />
      </Box>
    </Box>
  );
};

export default subscriptionDetails;
