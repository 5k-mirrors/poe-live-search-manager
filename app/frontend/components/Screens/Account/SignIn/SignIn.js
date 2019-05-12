import React from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase/app";
import * as FirebaseConfigs from "../../../../resources/FirebaseConfigs/FirebaseConfigs";

const signIn = () => (
  <div>
    <p>Sign in</p>
    <StyledFirebaseAuth
      uiConfig={FirebaseConfigs.ui}
      firebaseAuth={firebase.auth()}
    />
  </div>
);

export default signIn;
