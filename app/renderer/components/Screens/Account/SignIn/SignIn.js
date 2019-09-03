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
      <Typography paragraph variant="h5">
        {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
        Register or Sign in to <b>poe-sniper</b>
      </Typography>
      <Box fontStyle="italic" component="p">
        This is not your pathofexile.com account
      </Box>
      <StyledFirebaseAuth
        uiConfig={firebaseConfigs.ui}
        firebaseAuth={firebaseContext.app.auth()}
      />
    </Box>
  );
};

export default signIn;
