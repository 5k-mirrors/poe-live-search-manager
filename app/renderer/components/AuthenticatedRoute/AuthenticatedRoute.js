import React from "react";
import { Route, Redirect } from "react-router-dom";
import GlobalStore from "../../../shared/GlobalStore/GlobalStore";
import { storeKeys } from "../../../resources/StoreKeys/StoreKeys";
import { useAuthContext, useSubscriptionContext } from "../../contexts";

export default ({ ...restProps }) => {
  const globalStore = GlobalStore.getInstance();
  const { state: auth } = useAuthContext();
  const [state] = useSubscriptionContext();
  const poeSessionId = globalStore.get(storeKeys.POE_SESSION_ID);

  function conditionsAreFulfilled() {
    return auth && poeSessionId && state.data && state.data.plan;
  }

  if (conditionsAreFulfilled()) {
    return <Route {...restProps} />;
  }

  return <Redirect to="/account" />;
};
