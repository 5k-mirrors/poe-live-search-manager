import React from "react";
import firebase from "firebase/app";
import SessionIdEditor from "./SessionIdEditor/SessionIdEditor";
import Notifications from "./Notifications/Notifications";
import SubscriptionDetails from "./SubscriptionDetails/SubscriptionDetails";
import Button from "../../../UI/GeneralElements/Button/Button";
import FlexContainer from "../../../UI/GeneralElements/FlexContainer/FlexContainer";

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
      <Notifications />
      <SubscriptionDetails id={currentUser.uid} />
    </div>
  );
};

export default loggedIn;
