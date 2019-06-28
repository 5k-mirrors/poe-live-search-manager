import React from "react";
import Typography from "@material-ui/core/Typography";
import firebase from "firebase/app";
import FlexBox from "../../../UI/SimpleHtmlElements/FlexBox/FlexBox";
import SessionIdEditor from "./SessionIdEditor/SessionIdEditor";
import SubscriptionDetails from "./SubscriptionDetails/SubscriptionDetails";
import Button from "../../../UI/SimpleHtmlElements/Button/Button";

const loggedIn = () => {
  const { currentUser } = firebase.auth();

  const welcomeMessage = `Logged in as ${currentUser.displayName ||
    currentUser.email}`;

  return (
    <div>
      <FlexBox justifyContent="space-between">
        <Typography variant="h6" gutterBottom>
          {welcomeMessage}
        </Typography>
        <Button clickEvent={() => firebase.auth().signOut()} text="Sign out" />
      </FlexBox>
      <SessionIdEditor />
      <SubscriptionDetails id={currentUser.uid} />
    </div>
  );
};

export default loggedIn;
