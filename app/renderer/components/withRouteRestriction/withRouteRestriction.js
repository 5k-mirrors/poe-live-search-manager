import React, { useState, useEffect } from "react";
import { ipcRenderer } from "electron";
import { Redirect } from "react-router-dom";
import { globalStore } from "../../../GlobalStore/GlobalStore";
import { storeKeys } from "../../../resources/StoreKeys/StoreKeys";
import { ipcEvents } from "../../../resources/IPCEvents/IPCEvents";
import { useAuthContext } from "../../contexts/Auth";
import Loader from "../UI/Loader/Loader";

const withRouteRestriction = WrappedComponent => {
  return ({ ...props }) => {
    const auth = useAuthContext();
    const poeSessionId = globalStore.get(storeKeys.POE_SESSION_ID);
    const [isPaying, setIsPaying] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    function sendSubscriptionDetailsListener(e, subscriptionDetails) {
      setIsPaying(subscriptionDetails.data.paying === true);

      setIsLoading(false);
    }

    useEffect(() => {
      ipcRenderer.send(ipcEvents.GET_SUBSCRIPTION_DETAILS);

      ipcRenderer.on(
        ipcEvents.SEND_SUBSCRIPTION_DETAILS,
        sendSubscriptionDetailsListener
      );

      return () =>
        ipcRenderer.removeListener(
          ipcEvents.SEND_SUBSCRIPTION_DETAILS,
          sendSubscriptionDetailsListener
        );
    }, []);

    function conditionsAreFulfilled() {
      return auth.isLoggedIn && poeSessionId && isPaying;
    }

    if (isLoading) {
      return <Loader />;
    }

    if (conditionsAreFulfilled()) {
      return <WrappedComponent {...props} />;
    }

    return <Redirect to="/account" />;
  };
};

export default withRouteRestriction;
