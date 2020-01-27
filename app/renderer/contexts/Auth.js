import React, { createContext, useReducer, useEffect } from "react";
import { ipcRenderer } from "electron";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";
import GlobalStore from "../../GlobalStore/GlobalStore";
import { storeKeys } from "../../resources/StoreKeys/StoreKeys";
import { getApp as getFirebaseApp } from "../utils/Firebase/Firebase";
import { asyncFetchReducer, asyncFetchActions } from "../reducers/reducers";
import { useFactoryContext } from "../utils/ReactUtils/ReactUtils";

const AuthContext = createContext(null);
AuthContext.displayName = "AuthContext";

export const AuthProvider = ({ children }) => {
  const globalStore = GlobalStore.getInstance();

  const [state, dispatch] = useReducer(asyncFetchReducer, {
    data: null,
    isLoading: false,
    isLoggedIn: false,
  });

  useEffect(() => {
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

    const unregisterUserAuthObserver = registerUserAuthObserver();

    return () => unregisterUserAuthObserver();
  }, [globalStore]);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => useFactoryContext(AuthContext);
