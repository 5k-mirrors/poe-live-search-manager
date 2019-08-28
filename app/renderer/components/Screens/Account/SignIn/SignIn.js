import React from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import * as firebaseUtils from "../../../../utils/FirebaseUtils/FirebaseUtils";

const signIn = () => {
  const firebaseApp = firebaseUtils.getApp();

  const uiConfig = {
    signInOptions: [firebaseApp.auth.EmailAuthProvider.PROVIDER_ID],
    callbacks: {
      signInSuccessWithAuthResult: () => false,
    },
  };

  return (
    <div>
      <p>Sign in</p>
      <StyledFirebaseAuth
        uiConfig={uiConfig}
        firebaseAuth={firebaseApp.auth()}
      />
    </div>
  );
};

export default signIn;
