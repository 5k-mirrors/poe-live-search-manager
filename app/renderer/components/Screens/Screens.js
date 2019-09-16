import React from "react";
import { Switch, Route } from "react-router-dom";
import Searches from "./Searches/Searches";
import Account from "./Account/Account";
import Settings from "./Settings/Settings";
import Results from "./Results/Results";

const screens = () => (
  <Switch>
    <Route path="/searches" component={Searches} />
    <Route path="/settings" component={Settings} />
    <Route path="/results" component={Results} />
    <Route component={Account} />
  </Switch>
);

export default screens;
