import React from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "firebase/app";
import * as Firebase from "../../../../resources/Firebase/Firebase";

const signIn = () => (
  <div>
    <p>Sign in</p>
    <StyledFirebaseAuth
      uiConfig={Firebase.uiConfig}
      firebaseAuth={firebase.auth()}
    />
  </div>
);

export default signIn;
