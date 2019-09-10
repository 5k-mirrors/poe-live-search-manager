import React from "react";
import { Switch, Route } from "react-router-dom";
import Input from "./Input/Input";
import Account from "./Account/Account";
import Settings from "./Settings/Settings";

const screens = () => (
  <Switch>
    <Route path="/input" component={Input} />
    <Route path="/settings" component={Settings} />
    <Route component={Account} />
  </Switch>
);

export default screens;
