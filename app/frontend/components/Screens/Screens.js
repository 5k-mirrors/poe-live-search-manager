import React from "react";
import { Switch, Route } from "react-router-dom";
import Input from "./Input/Input";
import Trade from "./Trade/Trade";
import Account from "./Account/Account";

const screens = () => (
  <Switch>
    <Route path="/input" component={Input} />
    <Route path="/trade" component={Trade} />
    <Route path="/account" component={Account} />
  </Switch>
);

export default screens;
