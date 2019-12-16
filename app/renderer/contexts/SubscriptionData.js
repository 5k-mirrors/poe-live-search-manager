import React, { createContext, useEffect } from "react";
import { useIpc } from "../utils/CustomHooks/CustomHooks";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";

export const SubscriptionDataContext = createContext();

export const SubscriptionDataProvider = ({ children }) => {
  const [state, send] = useIpc(
    ipcEvents.GET_SUBSCRIPTION_DETAILS,
    ipcEvents.SEND_SUBSCRIPTION_DETAILS
  );

  useEffect(() => {
    send();
  }, [send]);

  return (
    <SubscriptionDataContext.Provider value={[state, send]}>
      {children}
    </SubscriptionDataContext.Provider>
  );
};
