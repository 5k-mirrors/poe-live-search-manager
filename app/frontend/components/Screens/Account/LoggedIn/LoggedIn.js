import React from "react";
import firebase from "firebase/app";
import styled from "styled-components";
import SessionIdEditor from "./SessionIdEditor/SessionIdEditor";
import Subscription from "./Subscription/Subscription";
import { loggedInHeader, signOutButton } from "./LoggedIn.style";

const StyledLoggedInHeader = styled.div`
  ${loggedInHeader}
`;

const StyledSignOutButton = styled.button`
  ${signOutButton}
`;

const loggedIn = () => {
  const { currentUser } = firebase.auth();

  const welcomeMessage = `Logged in as ${currentUser.displayName ||
    currentUser.email}`;

  return (
    <div>
      <StyledLoggedInHeader>
        <h3>{welcomeMessage}</h3>
        <StyledSignOutButton
          type="button"
          onClick={() => firebase.auth().signOut()}
        >
          Sign-out
        </StyledSignOutButton>
      </StyledLoggedInHeader>
      <SessionIdEditor />
      <Subscription id={currentUser.uid} />
    </div>
  );
};

export default loggedIn;
