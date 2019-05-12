import React from "react";
import firebase from "firebase/app";

const loggedIn = () => {
  const { currentUser } = firebase.auth();

  const welcomeMessage = `Logged in as ${currentUser.displayName ||
    currentUser.email}`;

  return (
    <div>
      <h1>{welcomeMessage}</h1>
      <button type="button" onClick={() => firebase.auth().signOut()}>
        Sign-out
      </button>
    </div>
  );
};

export default loggedIn;
