import React from "react";
import firebase from "firebase/app";

const loggedIn = () => {
  const welcomeMessage = `Logged in as ${firebase.auth().currentUser
    .displayName || firebase.auth().currentUser.email}`;

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
