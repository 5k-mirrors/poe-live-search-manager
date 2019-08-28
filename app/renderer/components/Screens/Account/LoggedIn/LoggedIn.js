import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import SessionIdEditor from "./SessionIdEditor/SessionIdEditor";
import SubscriptionDetails from "./SubscriptionDetails/SubscriptionDetails";
import Button from "../../../UI/SimpleHtmlElements/Button/Button";
import * as firebaseUtils from "../../../../utils/FirebaseUtils/FirebaseUtils";

const loggedIn = () => {
  const firebaseApp = firebaseUtils.getApp();

  const { currentUser } = firebaseApp.auth();

  const welcomeMessage = `Loggedd in as ${currentUser.displayName ||
    currentUser.email}`;

  return (
    <div>
      <Box
        display="flex"
        alignItems="center"
        mb={3}
        justifyContent="space-between"
      >
        <Typography variant="h6" gutterBottom>
          {welcomeMessage}
        </Typography>
        <Button
          clickEvent={() => firebaseApp.auth().signOut()}
          text="Sign out"
        />
      </Box>
      <SessionIdEditor />
      <SubscriptionDetails id={currentUser.uid} />
    </div>
  );
};

export default loggedIn;
