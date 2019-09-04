import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { globalStore } from "../../../GlobalStore/GlobalStore";
import { storeKeys } from "../../../resources/StoreKeys/StoreKeys";
import subscription from "../../../Subscription/Subscription";
import * as subscriptionActions from "../../../Subscription/Actions";
import * as firebaseUtils from "../../utils/FirebaseUtils/FirebaseUtils";

const withRouteRestriction = WrappedComponent => {
  return ({ ...props }) => {
    const isLoggedIn = globalStore.get(storeKeys.IS_LOGGED_IN, false);
    const poeSessionId = globalStore.get(storeKeys.POE_SESSION_ID, "");
    const firebaseContext = firebaseUtils.useFirebaseContext();

    async function refreshSubscriptionDetails() {
      if (isLoggedIn) {
        await subscriptionActions.refresh(firebaseContext.currentUser.uid);
      }
    }

    useEffect(() => {
      refreshSubscriptionDetails();
    }, []);

    const routeAccessIsAllowed =
      isLoggedIn && poeSessionId !== "" && subscription.active();

    if (routeAccessIsAllowed) {
      return <WrappedComponent {...props} />;
    }

    return <Redirect to="/account" />;
  };
};

export default withRouteRestriction;
