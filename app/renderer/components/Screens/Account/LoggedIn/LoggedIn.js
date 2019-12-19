import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import SessionIdEditor from "./SessionIdEditor/SessionIdEditor";
import SubscriptionDetails from "./SubscriptionDetails/SubscriptionDetails";
import Button from "../../../UI/SimpleHtmlElements/Button/Button";
import { getApp as getFirebaseApp } from "../../../../utils/Firebase/Firebase";

const firebaseAuth = getFirebaseApp().auth();

const loggedIn = () => (
  <div>
    <Box
      display="flex"
      alignItems="center"
      mb={3}
      justifyContent="space-between"
    >
      <Typography variant="h6" gutterBottom>
        {`Logged in as ${firebaseAuth.currentUser.displayName ||
          firebaseAuth.currentUser.email}`}
      </Typography>
      <Button clickEvent={() => firebaseAuth.signOut()} text="Sign out" />
    </Box>
    <SessionIdEditor />
    <SubscriptionDetails />
  </div>
);

export default loggedIn;
