import React, { useState, useEffect } from "react";
import { ipcRenderer } from "electron";
import {
  getApp,
  FirebaseContext,
} from "../../utils/FirebaseUtils/FirebaseUtils";
import { globalStore } from "../../../GlobalStore/GlobalStore";
import { storeKeys } from "../../../resources/StoreKeys/StoreKeys";
import { ipcEvents } from "../../../resources/IPCEvents/IPCEvents";

const Firebase = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  function startAuthObserver() {
    return getApp()
      .auth()
      .onAuthStateChanged(user => {
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

  useEffect(() => {
    startAuthObserver();
  }, []);

  return (
    <FirebaseContext.Provider
      value={{
        app: getApp(),
        currentUser,
        isLoading: currentUser === null,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export default Firebase;
