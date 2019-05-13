import React, { useState } from "react";
import firebase from "firebase/app";
import { globalStore } from "../../../../../GlobalStore/GlobalStore";
import { storeKeys } from "../../../../../resources/StoreKeys/StoreKeys";

// TODO: create a simple input field and also store the value into the `globalStore` -> button click. A simple `useState` hooks should be enough.
const loggedIn = () => {
  const [poeSessionId, setPoeSessionId] = useState("");
  const { currentUser } = firebase.auth();

  function onPoeSessionIdChange(e) {
    setPoeSessionId(e.target.value);
  }

  function onSaveButtonClick() {
    // globalStore.set("POESESSID", poeSessionId);
    globalStore.set(storeKeys.POE_SESSION_ID, poeSessionId);
  }

  const welcomeMessage = `Logged in as ${currentUser.displayName ||
    currentUser.email}`;

  // TODO: slightly refactor the appearance of this page.
  return (
    <div>
      <h1>{welcomeMessage}</h1>
      <input
        type="text"
        placeholder="PoE Session ID"
        onChange={e => onPoeSessionIdChange(e)}
        value={poeSessionId}
      />
      <button type="button" onClick={onSaveButtonClick}>
        Save
      </button>
      <button type="button" onClick={() => firebase.auth().signOut()}>
        Sign-out
      </button>
    </div>
  );
};

export default loggedIn;
