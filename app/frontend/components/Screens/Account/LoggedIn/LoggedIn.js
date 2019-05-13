import React from "react";
import firebase from "firebase/app";
import styled from "styled-components";
import SessionIdEditor from "./SessionIdEditor/SessionIdEditor";
import { LoggedInHeader, SignOutButton } from "./LoggedIn.style";

const loggedIn = () => {
  const { currentUser } = firebase.auth();

  const welcomeMessage = `Logged in as ${currentUser.displayName ||
    currentUser.email}`;

  const StyledLoggedInHeader = styled.div`
    ${LoggedInHeader}
  `;

  const StyledSignOutButton = styled.button`
    ${SignOutButton}
  `;

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
    </div>
  );
};

export default loggedIn;
