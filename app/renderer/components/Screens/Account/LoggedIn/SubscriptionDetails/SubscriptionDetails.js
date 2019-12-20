import React, { useEffect } from "react";
import Box from "@material-ui/core/Box";
import { ipcEvents } from "../../../../../../resources/IPCEvents/IPCEvents";
import Button from "../../../../UI/SimpleHtmlElements/Button/Button";
import Input from "../../../../UI/SimpleHtmlElements/Input/Input";
import * as firebaseUtils from "../../../../../utils/FirebaseUtils/FirebaseUtils";
import {
  useDisable,
  useRequestDataViaIpc,
} from "../../../../../utils/CustomHooks/CustomHooks";

export default () => {
  const firebaseContext = firebaseUtils.useFirebaseContext();

  const [state, requestDataViaIpc] = useRequestDataViaIpc(
    ipcEvents.SEND_SUBSCRIPTION_DETAILS
  );
  const [isDisabled, disableRefreshButton] = useDisable(1);

  useEffect(() => {
    requestDataViaIpc(ipcEvents.GET_SUBSCRIPTION_DETAILS);
  }, [requestDataViaIpc]);

  const onRefresh = () => {
    requestDataViaIpc(
      ipcEvents.FETCH_SUBSCRIPTION_DETAILS,
      firebaseContext.currentUser.uid
    );

    disableRefreshButton();
  };

  function subscriptionText() {
    if (state.isLoading) {
      return "Loading...";
    }

    if (state.isErr || !state.data) {
      return "Error while fetching data";
    }

    if (state.data && !state.data.paying) {
      return "Inactive";
    }

    if (state.data && state.data.paying) {
      return state.data.type ? state.data.type : "Active";
    }

    return "Loading...";
  }

  return (
    <Box mt={3}>
      <Input
        type="text"
        value={subscriptionText()}
        label="Subscription"
        error={
          state.isLoading || state.isErr || (state.data && !state.data.paying)
        }
        InputProps={{
          readOnly: true,
        }}
      />
      <Box mt={3}>
        <Button clickEvent={onRefresh} text="Refresh" disabled={isDisabled} />
      </Box>
    </Box>
  );
};
