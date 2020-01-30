/* eslint-disable react/jsx-one-expression-per-line */
import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import * as firebaseConfigs from "../../../../resources/FirebaseConfigs/FirebaseConfigs";
import { getApp as getFirebaseApp } from "../../../../utils/Firebase/Firebase";

const firebaseAuth = getFirebaseApp().auth();

const signIn = () => (
  <Box textAlign="center">
    <Typography variant="h5">
      Register or Sign in to <b>PoE Live Search Manager</b>
    </Typography>
    <Box fontSize={12} fontStyle="italic" mb={3} mt={0.5}>
      This is <b>not</b> your pathofexile.com account
    </Box>
    <StyledFirebaseAuth
      uiConfig={firebaseConfigs.ui}
      firebaseAuth={firebaseAuth}
    />
  </Box>
);

export default signIn;
