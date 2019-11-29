import React, { useEffect, useState } from "react";
import Box from "@material-ui/core/Box";
import { ipcRenderer } from "electron";
import * as customHooks from "../../../../../utils/CustomHooks/CustomHooks";
import { ipcEvents } from "../../../../../../resources/IPCEvents/IPCEvents";
import Button from "../../../../UI/SimpleHtmlElements/Button/Button";
import Input from "../../../../UI/SimpleHtmlElements/Input/Input";
import * as firebaseUtils from "../../../../../utils/FirebaseUtils/FirebaseUtils";

export default () => {
  const firebaseContext = firebaseUtils.useFirebaseContext();

  const [fetchedData, setFetchedData] = useState({
    data: null,
    isLoading: false,
    isErr: false,
  });

  const [isDisabled, disableRefreshButton] = customHooks.useDisable(1);

  function refreshFetchState(event, nextFetchState) {
    if (nextFetchState.isErr) {
      return setFetchedData(prevFetchedData => ({
        ...prevFetchedData,
        isLoading: false,
        isErr: true,
      }));
    }

    return setFetchedData(prevFetchedData => {
      const {
        data: { ...nextSubscriptionData },
      } = nextFetchState;

      return {
        ...prevFetchedData,
        data: nextSubscriptionData,
        isLoading: false,
        isErr: false,
      };
    });
  }

  useEffect(() => {
    ipcRenderer.send(ipcEvents.GET_SUBSCRIPTION_DETAILS);

    ipcRenderer.on(ipcEvents.SEND_SUBSCRIPTION_DETAILS, refreshFetchState);

    return () => {
      ipcRenderer.removeListener(
        ipcEvents.SEND_SUBSCRIPTION_DETAILS,
        refreshFetchState
      );
    };
  }, []);

  function onRefreshButtonClick() {
    setFetchedData(prevFetchedData => ({
      ...prevFetchedData,
      isLoading: true,
      isErr: false,
    }));

    ipcRenderer.send(
      ipcEvents.REFRESH_SUBSCRIPTION_DETAILS,
      firebaseContext.currentUser.uid
    );

    disableRefreshButton();
  }

  function subscriptionText() {
    if (fetchedData.isLoading) {
      return "Loading...";
    }

    if (fetchedData.isErr || !fetchedData.data) {
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
          fetchedData.isErr ||
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
