import React, { useEffect, useReducer } from "react";
import Box from "@material-ui/core/Box";
import { ipcRenderer } from "electron";
import * as customHooks from "../../../../../utils/CustomHooks/CustomHooks";
import { ipcEvents } from "../../../../../../resources/IPCEvents/IPCEvents";
import Button from "../../../../UI/SimpleHtmlElements/Button/Button";
import Input from "../../../../UI/SimpleHtmlElements/Input/Input";
import * as firebaseUtils from "../../../../../utils/FirebaseUtils/FirebaseUtils";

const initialState = {
  data: null,
  isLoading: false,
  isErr: false,
};

const actions = {
  REFRESH: "refresh",
  UPDATE: "update",
};

const reducer = (state, action) => {
  switch (action.type) {
    case actions.REFRESH: {
      return {
        ...state,
        isLoading: true,
        isErr: false,
      };
    }
    case actions.UPDATE: {
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload.data,
        },
        isLoading: false,
        isErr: action.payload.isErr ? action.payload.isErr : state.isErr,
      };
    }
    default:
      throw new Error(`Undefined reducer action: ${action}`);
  }
};

export default () => {
  const firebaseContext = firebaseUtils.useFirebaseContext();

  const [state, dispatch] = useReducer(reducer, initialState);
  const [isDisabled, disableRefreshButton] = customHooks.useDisable(1);

  function sendSubscriptionDetailsListener(event, nextSubscriptionDetails) {
    dispatch({ type: actions.UPDATE, payload: { ...nextSubscriptionDetails } });
  }

  useEffect(() => {
    dispatch({ type: actions.REFRESH });

    ipcRenderer.send(ipcEvents.GET_SUBSCRIPTION_DETAILS);

    ipcRenderer.on(
      ipcEvents.SEND_SUBSCRIPTION_DETAILS,
      sendSubscriptionDetailsListener
    );

    return () => {
      ipcRenderer.removeListener(
        ipcEvents.SEND_SUBSCRIPTION_DETAILS,
        sendSubscriptionDetailsListener
      );
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
