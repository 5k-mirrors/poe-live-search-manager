import React, { useEffect, useState } from "react";
import Box from "@material-ui/core/Box";
import { ipcRenderer } from "electron";
import * as customHooks from "../../../../../utils/CustomHooks/CustomHooks";
import subscription from "../../../../../../Subscription/Subscription";
import { subscriptionUpdated } from "../../../../../../Subscription/Actions";
import { ipcEvents } from "../../../../../../resources/IPCEvents/IPCEvents";
import Button from "../../../../UI/SimpleHtmlElements/Button/Button";
import Input from "../../../../UI/SimpleHtmlElements/Input/Input";
import * as firebaseUtils from "../../../../../utils/FirebaseUtils/FirebaseUtils";
import { devLog } from "../../../../../../utils/JavaScriptUtils/JavaScriptUtils";

export default () => {
  const firebaseContext = firebaseUtils.useFirebaseContext();

  const [fetchedData, setFetchedData] = useState({
    data: null,
    isLoading: false,
    error: false,
  });

  const [isDisabled, disableRefreshButton] = customHooks.useDisable(1);

  function updateSubscriptionDetails(e, updatedSubscriptionDetails) {
    setFetchedData(prevFetchedData => {
      return {
        ...prevFetchedData,
        data: {
          ...updatedSubscriptionDetails,
        },
      };
    });
  }

  useEffect(() => {
    ipcRenderer.send(ipcEvents.GET_SUBSCRIPTION_DETAILS);

    ipcRenderer.on(
      ipcEvents.SEND_SUBSCRIPTION_DETAILS,
      updateSubscriptionDetails
    );

    ipcRenderer.on(
      ipcEvents.SUBSCRIPTION_UPDATE_IN_MAIN,
      updateSubscriptionDetails
    );

    return () => {
      ipcRenderer.removeListener(
        ipcEvents.SEND_SUBSCRIPTION_DETAILS,
        updateSubscriptionDetails
      );

      ipcRenderer.removeListener(
        ipcEvents.SUBSCRIPTION_UPDATE_IN_MAIN,
        updateSubscriptionDetails
      );
    };
  }, []);

  function fetchSubscriptionDetails() {
    setFetchedData(prevFetchedData => ({
      ...prevFetchedData,
      isLoading: true,
      error: false,
    }));

    return subscription
      .query(firebaseContext.currentUser.uid)
      .then(updatedSubscriptionDetails => {
        setFetchedData(prevFetchedData => {
          const { data: prevSubscriptionDetails } = prevFetchedData;

          if (
            subscriptionUpdated(
              prevSubscriptionDetails,
              updatedSubscriptionDetails
            )
          ) {
            console.log("[UPDATED IN RENDERER]");
            ipcRenderer.send(
              ipcEvents.SUBSCRIPTION_UPDATE_IN_RENDERER,
              updatedSubscriptionDetails
            );
          }

          return {
            ...prevFetchedData,
            data: {
              ...updatedSubscriptionDetails,
            },
            isLoading: false,
          };
        });
      })
      .catch(err => {
        devLog(`Subscription fetch error: ${JSON.stringify(err)}`);

        setFetchedData(prevFetchedData => ({
          ...prevFetchedData,
          isLoading: false,
          error: true,
        }));
      });
  }

  function onRefreshButtonClick() {
    fetchSubscriptionDetails();

    disableRefreshButton();
  }

  function subscriptionText() {
    if (fetchedData.isLoading) {
      return "Loading...";
    }

    if (fetchedData.err || !fetchedData.data) {
      return "Error while fetching data";
    }

    if (fetchedData.data && fetchedData.data.paying) {
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
