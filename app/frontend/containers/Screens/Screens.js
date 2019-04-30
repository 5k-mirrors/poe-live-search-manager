import React from "react";
import { Switch, Route } from "react-router-dom";
import NavigationBar from "../../components/NavigationBar/NavigationBar";
import AccountScreen from "../../components/AccountScreen/AccountScreen";
import InputScreen from "../../components/InputScreen/InputScreen";
import TradeScreen from "../../components/TradeScreen/TradeScreen";

const screens = () => (
  <div>
    <NavigationBar />
    <Switch>
      <Route path="/input" component={InputScreen} />
      <Route path="/trade" component={TradeScreen} />
      <Route path="/" component={AccountScreen} />
    </Switch>
  </div>
);

export default screens;
