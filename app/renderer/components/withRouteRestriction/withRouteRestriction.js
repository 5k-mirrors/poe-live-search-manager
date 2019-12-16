import React from "react";
import { Redirect } from "react-router-dom";
import { globalStore } from "../../../GlobalStore/GlobalStore";
import { storeKeys } from "../../../resources/StoreKeys/StoreKeys";
import { useAuthDataContext, useSubscriptionDataContext } from "../../contexts";

const withRouteRestriction = WrappedComponent => {
  return ({ ...props }) => {
    const authData = useAuthDataContext();
    const [state] = useSubscriptionDataContext();
    const poeSessionId = globalStore.get(storeKeys.POE_SESSION_ID);

    function conditionsAreFulfilled() {
      return authData && poeSessionId && state.data.paying;
    }

    if (conditionsAreFulfilled()) {
      return <WrappedComponent {...props} />;
    }

    return <Redirect to="/account" />;
  };
};

export default withRouteRestriction;
