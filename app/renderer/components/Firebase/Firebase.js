import React, { useState, useEffect } from "react";
import firebase from "firebase";
import { ipcRenderer } from "electron";
import { FirebaseContext } from "../../utils/FirebaseUtils/FirebaseUtils";
import { globalStore } from "../../../GlobalStore/GlobalStore";
import { storeKeys } from "../../../resources/StoreKeys/StoreKeys";
import { ipcEvents } from "../../../resources/IPCEvents/IPCEvents";
import * as javaScriptUtils from "../../../utils/JavaScriptUtils/JavaScriptUtils";

const Firebase = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  function getApp() {
    // https://stackoverflow.com/a/41005100/9599137
    if (firebase.apps.length) {
      return firebase.apps[0];
    }

    return firebase.initializeApp({
      apiKey: process.env.FIREBASE_API_KEY,
    });
  }

  function startAuthObserver() {
    const firebaseApp = getApp();

    return firebaseApp.auth().onAuthStateChanged(user => {
      setCurrentUser(user);

      const isLoggedIn = !!user;

      globalStore.set(storeKeys.IS_LOGGED_IN, isLoggedIn);

      if (isLoggedIn) {
        ipcRenderer.send(ipcEvents.USER_LOGIN, user.uid);
      } else {
        ipcRenderer.send(ipcEvents.USER_LOGOUT);
      }
    });
  }

  let unregisterAuthObserver;

  useEffect(() => {
    unregisterAuthObserver = startAuthObserver();

    return () => unregisterAuthObserver();
  }, []);

  return (
    <FirebaseContext.Provider
      value={{
        app: getApp(),
        userIsLoading: !javaScriptUtils.isDefined(currentUser),
        currentUser,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export default Firebase;
