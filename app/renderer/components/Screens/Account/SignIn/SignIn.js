/* eslint-disable react/jsx-one-expression-per-line */
import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import * as firebaseConfigs from "../../../../resources/FirebaseConfigs/FirebaseConfigs";
import * as firebaseUtils from "../../../../utils/FirebaseUtils/FirebaseUtils";

const signIn = () => {
  const firebaseContext = firebaseUtils.useFirebaseContext();

  return (
    <Box textAlign="center">
      <Typography variant="h5">
        Register or Sign in to <b>poe-sniper</b>
      </Typography>
      <Box fontSize={12} fontStyle="italic" mb={3} mt={0.5}>
        This is <b>not</b> your pathofexile.com account
      </Box>
      <StyledFirebaseAuth
        uiConfig={firebaseConfigs.ui}
        firebaseAuth={firebaseContext.app.auth()}
      />
    </Box>
  );
};

export default signIn;
