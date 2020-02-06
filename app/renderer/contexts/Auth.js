import React, { createContext, useReducer, useEffect } from "react";
import { ipcRenderer } from "electron";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";
import { getApp as getFirebaseApp } from "../utils/Firebase/Firebase";
import { asyncFetchReducer, asyncFetchActions } from "../reducers/reducers";
import { useFactoryContext } from "../utils/ReactUtils/ReactUtils";

const AuthContext = createContext(null);
AuthContext.displayName = "AuthContext";

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(asyncFetchReducer, {
    data: null,
    isLoading: false,
    isLoggedIn: false,
  });

  useEffect(() => {
    const registerAuthStateChangedObserver = () => {
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

        if (userAuthenticated) {
          user.getIdToken().then(token => {
            ipcRenderer.send(ipcEvents.USER_LOGIN, user.uid, token);
          });
        } else {
          ipcRenderer.send(ipcEvents.USER_LOGOUT);
        }
      });
    };

    const unregisterAuthStateChangedObserver = registerAuthStateChangedObserver();

    return () => unregisterAuthStateChangedObserver();
  }, []);

  useEffect(() => {
    const registerIdTokenChangedObserver = () => {
      const firebaseApp = getFirebaseApp();

      return firebaseApp.auth().onIdTokenChanged(user => {
        if (user) {
          user.getIdToken().then(token => {
            ipcRenderer.send(ipcEvents.ID_TOKEN_CHANGED, token);
          });
        }
      });
    };

    const unregisterIdTokenChangedObserver = registerIdTokenChangedObserver();

    return () => unregisterIdTokenChangedObserver();
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useFactoryContext(AuthContext);
