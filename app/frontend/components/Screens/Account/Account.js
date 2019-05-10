import React, { Component } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
// https://github.com/firebase/firebaseui-web/issues/536#issuecomment-452486686
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { globalStore } from "../../../../GlobalStore/GlobalStore";
import * as FirebaseUtils from "../../../utils/FirebaseUtils/FirebaseUtils";
import * as Firebase from "../../../resources/Firebase/Firebase";

FirebaseUtils.initializeApp();

class Account extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: globalStore.get("isLoggedIn", false)
    };

    // TODO: already used similarly in Trade.js -> create a separated function.
    this.onIsLoggedInChange = this.onIsLoggedInChange.bind(this);
    this.removeIsLoggedInListener = globalStore.onDidChange(
      "messages",
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

    // TODO: create different components?
    // E.g. sign-in + logged in.
    if (!isLoggedIn) {
      return (
        <div>
          <h1>My App</h1>
          <p>Please sign-in:</p>
          <StyledFirebaseAuth
            uiConfig={Firebase.uiConfig}
            firebaseAuth={firebase.auth()}
          />
        </div>
      );
    }
    return (
      <div>
        <h1>Account</h1>
        <button type="button" onClick={() => firebase.auth().signOut()}>
          Sign-out
        </button>
      </div>
    );
  }
}

export default Account;
