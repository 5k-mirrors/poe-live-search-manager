import React, { useEffect, useReducer } from "react";
import Box from "@material-ui/core/Box";
import { ipcRenderer } from "electron";
import * as customHooks from "../../../../../utils/CustomHooks/CustomHooks";
import { ipcEvents } from "../../../../../../resources/IPCEvents/IPCEvents";
import Button from "../../../../UI/SimpleHtmlElements/Button/Button";
import Input from "../../../../UI/SimpleHtmlElements/Input/Input";
import * as firebaseUtils from "../../../../../utils/FirebaseUtils/FirebaseUtils";
import { actions, reducer } from "./reducer";

const initialState = {
  data: null,
  isLoading: false,
  isErr: false,
};

export default () => {
  const firebaseContext = firebaseUtils.useFirebaseContext();

  const [state, dispatch] = useReducer(reducer, initialState);
  const [isDisabled, disableRefreshButton] = customHooks.useDisable(1);

  function foo(event, nextSubscriptionDetails) {
    dispatch({ type: actions.UPDATE, payload: nextSubscriptionDetails });
  }

  useEffect(() => {
    dispatch({ type: actions.REFRESH });

    ipcRenderer.send(ipcEvents.GET_SUBSCRIPTION_DETAILS);

    ipcRenderer.on(ipcEvents.SEND_SUBSCRIPTION_DETAILS, foo);

    return () => {
      ipcRenderer.removeListener(ipcEvents.SEND_SUBSCRIPTION_DETAILS, foo);
    };
  }, []);

  function onRefresh() {
    dispatch({ type: actions.REFRESH });

    ipcRenderer.send(
      ipcEvents.REFRESH_SUBSCRIPTION_DETAILS,
      firebaseContext.currentUser.uid
    );

    disableRefreshButton();
  }

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
