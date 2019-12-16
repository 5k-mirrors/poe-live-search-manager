import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import News from "./News/News";
import Searches from "./Searches/Searches";
import Account from "./Account/Account";
import Settings from "./Settings/Settings";
import Results from "./Results/Results";
import { globalStore } from "../../../GlobalStore/GlobalStore";
import { storeKeys } from "../../../resources/StoreKeys/StoreKeys";
import { useAuthDataContext, useSubscriptionDataContext } from "../../contexts";

const PrivateRoute = ({ ...restProps }) => {
  const authData = useAuthDataContext();
  const [state] = useSubscriptionDataContext();
  const poeSessionId = globalStore.get(storeKeys.POE_SESSION_ID);

  function conditionsAreFulfilled() {
    return authData && poeSessionId && state.data.paying;
  }

  if (conditionsAreFulfilled()) {
    return <Route {...restProps} />;
  }

  return <Redirect to="/account" />;
};

const screens = () => (
  <Switch>
    <Route path="/account" component={Account} />
    <PrivateRoute path="/searches" component={Searches} />
    <PrivateRoute path="/settings" component={Settings} />
    <PrivateRoute path="/results" component={Results} />
    <Route component={News} />
  </Switch>
);

export default screens;
