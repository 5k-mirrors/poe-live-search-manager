import React from "react";
import { Route, Redirect } from "react-router-dom";
import { globalStore } from "../../../GlobalStore/GlobalStore";
import { storeKeys } from "../../../resources/StoreKeys/StoreKeys";
import { useAuthContext, useSubscriptionContext } from "../../contexts";

export default ({ ...restProps }) => {
  const authData = useAuthContext();
  const [state] = useSubscriptionContext();
  const poeSessionId = globalStore.get(storeKeys.POE_SESSION_ID);

  function conditionsAreFulfilled() {
    return authData && poeSessionId && state.data.paying;
  }

  if (conditionsAreFulfilled()) {
    return <Route {...restProps} />;
  }

  return <Redirect to="/account" />;
};
