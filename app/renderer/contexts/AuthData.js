import React, { createContext, useState, useEffect } from "react";
import { ipcRenderer } from "electron";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";
import { globalStore } from "../../GlobalStore/GlobalStore";
import { storeKeys } from "../../resources/StoreKeys/StoreKeys";
import getFirebaseApp from "../utils/GetFirebaseApp/GetFirebaseApp";

export const AuthDataContext = createContext();

export const AuthDataProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  const registerObserver = () => {
    const firebaseApp = getFirebaseApp();

    return firebaseApp.auth().onAuthStateChanged(user => {
      setUserData(user);

      const userAuthenticated = !!user;

      globalStore.set(storeKeys.IS_LOGGED_IN, userAuthenticated);

      if (userAuthenticated) {
        ipcRenderer.send(ipcEvents.USER_LOGIN, user.uid);
      } else {
        ipcRenderer.send(ipcEvents.USER_LOGOUT);
      }
    });
  };

  useEffect(() => {
    const unregisterObserver = registerObserver();

    return () => unregisterObserver();
  }, []);

  return (
    <AuthDataContext.Provider value={userData}>
      {children}
    </AuthDataContext.Provider>
  );
};
