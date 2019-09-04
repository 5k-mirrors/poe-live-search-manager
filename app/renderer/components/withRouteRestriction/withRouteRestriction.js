import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";
import { globalStore } from "../../../GlobalStore/GlobalStore";
import { storeKeys } from "../../../resources/StoreKeys/StoreKeys";
import subscription from "../../../Subscription/Subscription";
import * as subscriptionActions from "../../../Subscription/Actions";
import * as javaScriptUtils from "../../../utils/JavaScriptUtils/JavaScriptUtils";
import * as firebaseUtils from "../../utils/FirebaseUtils/FirebaseUtils";

const withRouteRestriction = WrappedComponent => {
  return ({ ...props }) => {
    const isLoggedIn = globalStore.get(storeKeys.IS_LOGGED_IN, false);
    const poeSessionId = globalStore.get(storeKeys.POE_SESSION_ID, null);
    const firebaseContext = firebaseUtils.useFirebaseContext();

    async function refresh() {
      await subscriptionActions.refresh(firebaseContext.currentUser.uid);
    }

    useEffect(() => {
      refresh();
    }, []);

    const userIsEligible =
      isLoggedIn &&
      javaScriptUtils.isDefined(poeSessionId) &&
      subscription.active();

    if (userIsEligible) {
      return <WrappedComponent {...props} />;
    }

    return <Redirect to="/account" />;
  };
};

export default withRouteRestriction;
