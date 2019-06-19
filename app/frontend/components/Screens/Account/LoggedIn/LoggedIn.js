import React from "react";
import firebase from "firebase/app";
import styled from "styled-components";
import SessionIdEditor from "./SessionIdEditor/SessionIdEditor";
import SubscriptionDetails from "./SubscriptionDetails/SubscriptionDetails";
import Button from "../../../UI/Button/Button";
import { loggedInHeader } from "./LoggedIn.style";

const StyledLoggedInHeader = styled.div`
  ${loggedInHeader}
`;

const loggedIn = () => {
  const { currentUser } = firebase.auth();

  const welcomeMessage = `Logged in as ${currentUser.displayName ||
    currentUser.email}`;

  return (
    <div>
      <StyledLoggedInHeader>
        <h3>{welcomeMessage}</h3>
        <Button clickEvent={() => firebase.auth().signOut()} text="Sign out" />
      </StyledLoggedInHeader>
      <SessionIdEditor />
      <SubscriptionDetails id={currentUser.uid} />
    </div>
  );
};

export default loggedIn;
