import React from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import * as firebaseConfigs from "../../../../resources/FirebaseConfigs/FirebaseConfigs";
import * as firebaseUtils from "../../../../utils/FirebaseUtils/FirebaseUtils";

const signIn = () => {
  const firebaseContext = firebaseUtils.useFirebaseContext();

  return (
    <div>
      <p>Sign in</p>
      <StyledFirebaseAuth
        uiConfig={firebaseConfigs.ui}
        firebaseAuth={firebaseContext.app.auth()}
      />
    </div>
  );
};

export default signIn;
