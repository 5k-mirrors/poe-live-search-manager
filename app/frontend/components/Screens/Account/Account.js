import React, { Component } from "react";
import SignIn from "./SignIn/SignIn";
import LoggedIn from "./LoggedIn/LoggedIn";
import { globalStore } from "../../../../GlobalStore/GlobalStore";
import * as FirebaseUtils from "../../../utils/FirebaseUtils/FirebaseUtils";

// TODO: shouldn't it be moved to frontend/index.js?
FirebaseUtils.initializeApp();

class Account extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: globalStore.get("isLoggedIn", false)
    };

    this.onIsLoggedInChange = this.onIsLoggedInChange.bind(this);
    this.removeIsLoggedInListener = globalStore.onDidChange(
      "isLoggedIn",
      this.onIsLoggedInChange
    );
  }

  // TODO: the state should also be updated whenever `isLoggedIn` is updated.
  // Idea: how about creating a HOC?

  componentWillUnmount() {
    this.removeIsLoggedInListener();
  }

  onIsLoggedInChange(updatedIsLoggedIn) {
    this.setState({
      isLoggedIn: updatedIsLoggedIn
    });
  }

  render() {
    const { isLoggedIn } = this.state;

    if (!isLoggedIn) {
      return <SignIn />;
    }

    return <LoggedIn />;
  }
}

export default Account;
