import React from "react";
import Box from "@material-ui/core/Box";
import { ipcRenderer } from "electron";
import * as customHooks from "../../../../../utils/CustomHooks/CustomHooks";
import subscription from "../../../../../../Subscription/Subscription";
import { ipcEvents } from "../../../../../../resources/IPCEvents/IPCEvents";
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

    disableRefreshButton();
  }

  function subscriptionText() {
    if (fetchedData.isLoading) {
      return "Loading...";
    }

    if (fetchedData.err || !fetchedData.data) {
      return "Error while fetching data";
    }

    if (fetchedData.data) {
      ipcRenderer.send(ipcEvents.SUBSCRIPTION_UPDATE, fetchedData.data);

      if (fetchedData.data.paying) {
        return fetchedData.data.type ? fetchedData.data.type : "Active";
      }
    }

    return "Inactive";
  }

  return (
    <Box mt={3} mb={3}>
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
