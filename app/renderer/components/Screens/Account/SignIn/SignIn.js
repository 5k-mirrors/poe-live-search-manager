/* eslint-disable react/jsx-one-expression-per-line */
import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import * as firebaseConfigs from "../../../../resources/FirebaseConfigs/FirebaseConfigs";

const signIn = () => (
  <Box textAlign="center">
    <Typography variant="h5">
      Register or Sign in to <b>PoE Live Search Manager</b>
    </Typography>
    <Box fontSize={12} fontStyle="italic" mb={3} mt={0.5}>
      This is <b>not</b> your pathofexile.com account
    </Box>
  </Box>
);

export default signIn;
