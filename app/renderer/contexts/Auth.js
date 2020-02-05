import React, { createContext, useReducer, useEffect } from "react";
import { ipcRenderer } from "electron";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";
import SingletonGlobalStore from "../../GlobalStore/GlobalStore";
import { storeKeys } from "../../resources/StoreKeys/StoreKeys";
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
        const globalStore = new SingletonGlobalStore();

        dispatch({
          type: asyncFetchActions.RECEIVE_RESPONSE,
          payload: {
            data: user,
            isLoggedIn: userAuthenticated,
          },
        });

        globalStore.set(storeKeys.IS_LOGGED_IN, userAuthenticated);

        if (userAuthenticated) {
          return user.getIdToken().then(token => {
            ipcRenderer.send(ipcEvents.USER_LOGIN, user.uid, token);
          });
        }

        return ipcRenderer.send(ipcEvents.USER_LOGOUT);
      });
    };

    const unregisterAuthStateChangedObserver = registerAuthStateChangedObserver();

    return () => unregisterAuthStateChangedObserver();
  }, []);

  useEffect(() => {
    const registerIdTokenChangedObserver = () => {
      const firebaseApp = getFirebaseApp();

      return firebaseApp.auth().onIdTokenChanged(user => {
        const loggedIn = !!user;

        if (loggedIn) {
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
