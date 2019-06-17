import React from "react";
import firebase from "firebase/app";
import styled from "styled-components";
import SessionIdEditor from "./SessionIdEditor/SessionIdEditor";
import SubscriptionDetails from "./SubscriptionDetails/SubscriptionDetails";
import { loggedInHeader, signoutButton } from "./LoggedIn.style";

const StyledLoggedInHeader = styled.div`
  ${loggedInHeader}
`;

const StyledSignoutButton = styled.button`
  ${signoutButton}
`;

const loggedIn = () => {
  const { currentUser } = firebase.auth();

  const welcomeMessage = `Logged in as ${currentUser.displayName ||
    currentUser.email}`;

  return (
    <div>
      <StyledLoggedInHeader>
        <h3>{welcomeMessage}</h3>
        <StyledSignoutButton onClick={() => firebase.auth().signOut()}>
          Sign out
        </StyledSignoutButton>
      </StyledLoggedInHeader>
      <SessionIdEditor />
      <SubscriptionDetails id={currentUser.uid} />
    </div>
  );
};

export default loggedIn;
