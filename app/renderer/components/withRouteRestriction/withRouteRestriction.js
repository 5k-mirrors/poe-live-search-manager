import React from "react";
import { Redirect } from "react-router-dom";
import { globalStore } from "../../../GlobalStore/GlobalStore";
import { storeKeys } from "../../../resources/StoreKeys/StoreKeys";
import { useAuthContext, useSubscriptionContext } from "../../contexts";

export default WrappedComponent => ({ ...props }) => {
  const auth = useAuthContext();
  const [subscription] = useSubscriptionContext();
  const poeSessionId = globalStore.get(storeKeys.POE_SESSION_ID);

  const conditionsAreFulfilled = () =>
    auth.isLoggedIn &&
    poeSessionId &&
    subscription.data &&
    subscription.data.paying;

  if (conditionsAreFulfilled()) {
    return <WrappedComponent {...props} />;
  }

  return <Redirect to="/account" />;
};
