import React from "react";
import { Switch, Route } from "react-router-dom";
import News from "./News/News";
import Searches from "./Searches/Searches";
import Account from "./Account/Account";
import Settings from "./Settings/Settings";
import Results from "./Results/Results";

const Screens = () => (
  <Switch>
    <Route path="/account" component={Account} />
    <Route path="/searches" component={Searches} />
    <Route path="/settings" component={Settings} />
    <Route path="/results" component={Results} />
    <Route component={News} />
  </Switch>
);

export default Screens;
