import React from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import * as firebaseUtils from "../../../../utils/FirebaseUtils/FirebaseUtils";

const signIn = () => {
  const firebaseContext = firebaseUtils.useFirebaseContext();

  const uiConfig = {
    signInOptions: [firebaseContext.app.auth.EmailAuthProvider.PROVIDER_ID],
    callbacks: {
      signInSuccessWithAuthResult: () => false,
    },
  };

  return (
    <div>
      <p>Sign in</p>
      <StyledFirebaseAuth
        uiConfig={uiConfig}
        firebaseAuth={firebaseContext.app.auth()}
      />
    </div>
  );
};

export default signIn;
