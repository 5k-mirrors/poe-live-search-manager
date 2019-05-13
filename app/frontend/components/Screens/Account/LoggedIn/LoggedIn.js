import React from "react";
import firebase from "firebase/app";
import SessionID from "./SessionID/SessionID";

const loggedIn = () => {
  const { currentUser } = firebase.auth();

  const welcomeMessage = `Logged in as ${currentUser.displayName ||
    currentUser.email}`;

  // TODO: slightly refactor the appearance of this page.
  // TODO: create reusable styled-components.
  return (
    <div
      style={{
        width: "90%",
        margin: "0 auto"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center"
        }}
      >
        <h3>{welcomeMessage}</h3>
        <button
          style={{ margin: "10px", padding: "5px 8px" }}
          type="button"
          onClick={() => firebase.auth().signOut()}
        >
          Sign-out
        </button>
      </div>
      <SessionID />
    </div>
  );
};

export default loggedIn;
