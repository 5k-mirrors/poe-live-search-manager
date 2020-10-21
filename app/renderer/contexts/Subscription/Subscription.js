import React, { createContext, useEffect, useState, useCallback } from "react";
import { ipcRenderer } from "electron";

import { ipcEvents } from "../../../resources/IPCEvents/IPCEvents";
import { useFactoryContext } from "../../utils/ReactUtils/ReactUtils";
import { cloneDeep } from "../../../utils/JavaScriptUtils/JavaScriptUtils";

const SubscriptionContext = createContext();
SubscriptionContext.displayName = "SubscriptionContext";

// Provides a state of {data, isLoading, isErr}
// Provides a function to update the state explicitly by providing an Event to invoke
// Subscribes to updates via `updateEvent` if provided
const useDataFromMain = updateEvent => {
  const [state, setState] = useState({
    data: null,
    isLoading: false,
    isErr: false,
  });

  // TODO: Is cloneDeep needed?
  const updateState = useCallback(newState => {
    setState(prevState => {
      return {
        ...cloneDeep(prevState),
        ...cloneDeep(newState),
      };
    });
  }, []);

  useEffect(() => {
    if (updateEvent) {
      ipcRenderer.on(updateEvent, updateState);

      return () => ipcRenderer.removeListener(updateEvent, updateState);
    }
    return null;
  }, [updateEvent, updateState]);

  const requestDataViaIpc = useCallback(
    requestEvent => {
      setState(prevState => {
        return {
          ...cloneDeep(prevState),
          isLoading: true,
          isErr: false,
        };
      });
      ipcRenderer.invoke(requestEvent).then(result => {
        updateState({ isLoading: false, ...cloneDeep(result) });
      });
    },
    [updateState]
  );

  return [state, requestDataViaIpc];
};

// Subscription is stored in one central context, accessible from everywhere in renderer
// Queries are made in main and are kept in sync with renderer
export const SubscriptionProvider = ({ children }) => {
  const [state, requestDataViaIpc] = useDataFromMain(
    ipcEvents.UPDATE_SUBSCRIPTION_DETAILS
  );

  useEffect(() => {
    requestDataViaIpc(ipcEvents.GET_SUBSCRIPTION_DETAILS);
  }, [requestDataViaIpc]);

  const fetchSubscriptionDetails = () => {
    requestDataViaIpc(ipcEvents.FETCH_SUBSCRIPTION_DETAILS);
  };

  return (
    <SubscriptionContext.Provider value={[state, fetchSubscriptionDetails]}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscriptionContext = () =>
  useFactoryContext(SubscriptionContext);
