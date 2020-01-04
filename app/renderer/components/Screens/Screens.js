import React from "react";
import { Switch, Route } from "react-router-dom";
import AuthenticatedRoute from "../AuthenticatedRoute/AuthenticatedRoute";
import News from "./News/News";
import Searches from "./Searches/Searches";
import Account from "./Account/Account";
import Settings from "./Settings/Settings";
import Results from "./Results/Results";

const screens = () => (
  <Switch>
    <Route path="/account" component={Account} />
    <AuthenticatedRoute path="/searches" component={Searches} />
    <AuthenticatedRoute path="/settings" component={Settings} />
    <AuthenticatedRoute path="/results" component={Results} />
    <Route component={News} />
  </Switch>
);

export default screens;
