import React from "react";
import Box from "@material-ui/core/Box";
import { ipcEvents } from "../../../../../../resources/IPCEvents/IPCEvents";
import Button from "../../../../UI/SimpleHtmlElements/Button/Button";
import Input from "../../../../UI/SimpleHtmlElements/Input/Input";
import {
  useAuthDataContext,
  useSubscriptionDataContext,
} from "../../../../../contexts";
import { useDisable } from "../../../../../utils/CustomHooks/CustomHooks";

export default () => {
  const authData = useAuthDataContext();
  const [state, send] = useSubscriptionDataContext();
  const [isDisabled, disableRefreshButton] = useDisable(1);

  const onRefresh = () => {
    send(ipcEvents.REFRESH_SUBSCRIPTION_DETAILS, authData.uid);

    disableRefreshButton();
  };

  function subscriptionText() {
    if (state.isLoading) {
      return "Loading...";
    }

    if (state.isErr || !state.data) {
      return "Error while fetching data";
    }

    if (state.data && state.data.paying) {
      return state.data.type ? state.data.type : "Active";
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
