import React from "react";
import firebase from "firebase/app";
import SessionIdEditor from "./SessionIdEditor/SessionIdEditor";
import SubscriptionDetails from "./SubscriptionDetails/SubscriptionDetails";
import Button from "../../../UI/SimpleHtmlElements/Button/Button";
import FlexContainer from "../../../UI/SimpleHtmlElements/FlexContainer/FlexContainer";

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
      <SubscriptionDetails id={currentUser.uid} />
    </div>
  );
};

export default loggedIn;
