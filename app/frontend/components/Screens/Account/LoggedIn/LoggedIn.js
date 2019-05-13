import React from "react";
import firebase from "firebase/app";
import SessionID from "./SessionID/SessionID";

const loggedIn = () => {
  const { currentUser } = firebase.auth();

  const welcomeMessage = `Logged in as ${currentUser.displayName ||
    currentUser.email}`;

  // TODO: slightly refactor the appearance of this page.
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between"
      }}
    >
      <h1>{welcomeMessage}</h1>
      <button type="button" onClick={() => firebase.auth().signOut()}>
        Sign-out
      </button>
      <SessionID />
    </div>
  );
};

export default loggedIn;
