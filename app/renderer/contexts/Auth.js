import React, { createContext, useReducer, useEffect, useContext } from "react";
import { ipcRenderer } from "electron";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";
import { globalStore } from "../../GlobalStore/GlobalStore";
import { storeKeys } from "../../resources/StoreKeys/StoreKeys";
import { getApp as getFirebaseApp } from "../utils/Firebase/Firebase";
import { asyncFetchReducer, asyncFetchActions } from "../reducers/reducers";

const AuthContext = createContext(null);

const factoryContext = context => () => {
  const ctx = useContext(context);

  if (typeof ctx === "undefined") {
    throw new Error("Context value cannot be consumed outside providers.");
  }

  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(asyncFetchReducer, {
    data: null,
    isLoading: false,
    isLoggedIn: false,
  });

  const registerUserAuthObserver = () => {
    dispatch({ type: asyncFetchActions.SEND_REQUEST });

    const firebaseApp = getFirebaseApp();

    return firebaseApp.auth().onAuthStateChanged(user => {
      const userAuthenticated = !!user;

      dispatch({
        type: asyncFetchActions.RECEIVE_RESPONSE,
        payload: {
          data: user,
          isLoggedIn: userAuthenticated,
        },
      });

      globalStore.set(storeKeys.IS_LOGGED_IN, userAuthenticated);

      if (userAuthenticated) {
        ipcRenderer.send(ipcEvents.USER_LOGIN, user.uid);
      } else {
        ipcRenderer.send(ipcEvents.USER_LOGOUT);
      }
    });
  };

  useEffect(() => {
    const unregisterUserAuthObserver = registerUserAuthObserver();

    return () => unregisterUserAuthObserver();
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};

export const useAuthContext = factoryContext(AuthContext);
