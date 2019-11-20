import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import ChargebeeWidget from "./ChargebeeWidget/ChargebeeWidget";
import SessionIdEditor from "./SessionIdEditor/SessionIdEditor";
import SubscriptionDetails from "./SubscriptionDetails/SubscriptionDetails";
import Button from "../../../UI/SimpleHtmlElements/Button/Button";
import Loader from "../../../UI/Loader/Loader";
import * as firebaseUtils from "../../../../utils/FirebaseUtils/FirebaseUtils";

const loggedIn = () => {
  const firebaseContext = firebaseUtils.useFirebaseContext();

  function getMessage() {
    return `Logged in as ${firebaseContext.currentUser.displayName ||
      firebaseContext.currentUser.email}`;
  }

  if (firebaseContext.userIsLoading) {
    return <Loader />;
  }

  return (
    <div>
      <Box
        display="flex"
        alignItems="center"
        mb={3}
        justifyContent="space-between"
      >
        <Typography variant="h6" gutterBottom>
          {getMessage()}
        </Typography>
        <Button
          clickEvent={() => firebaseContext.app.auth().signOut()}
          text="Sign out"
        />
      </Box>
      <SessionIdEditor />
      <SubscriptionDetails />
      <ChargebeeWidget />
    </div>
  );
};

export default loggedIn;
