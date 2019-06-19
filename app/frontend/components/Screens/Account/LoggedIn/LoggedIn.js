import React from "react";
import firebase from "firebase/app";
import SessionIdEditor from "./SessionIdEditor/SessionIdEditor";
import NotificationDisplayTime from "./NotificationDisplayTime/NotificationDisplayTime";
import SubscriptionDetails from "./SubscriptionDetails/SubscriptionDetails";
import Button from "../../../UI/Button/Button";
import FlexContainer from "../../../UI/FlexContainer/FlexContainer";

const loggedIn = () => {
  const { currentUser } = firebase.auth();

  const welcomeMessage = `Logged in as ${currentUser.displayName ||
    currentUser.email}`;

  return (
    <div>
      <FlexContainer>
        <h3>{welcomeMessage}</h3>
        <Button clickEvent={() => firebase.auth().signOut()} text="Sign out" />
      </FlexContainer>
      <SessionIdEditor />
      <NotificationDisplayTime />
      <SubscriptionDetails id={currentUser.uid} />
    </div>
  );
};

export default loggedIn;
