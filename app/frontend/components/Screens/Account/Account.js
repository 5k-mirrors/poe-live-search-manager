import React, { Component } from "react";
import SignIn from "./SignIn/SignIn";
import LoggedIn from "./LoggedIn/LoggedIn";
import withStoreListener from "../../withStoreListener/withStoreListener";
import { globalStore } from "../../../../GlobalStore/GlobalStore";

class Account extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: globalStore.get("isLoggedIn", false)
    };
  }

  render() {
    const { isLoggedIn } = this.state;

    if (!isLoggedIn) {
      return <SignIn />;
    }

    return <LoggedIn />;
  }
}

export default withStoreListener(Account, "isLoggedIn", "isLoggedIn");
