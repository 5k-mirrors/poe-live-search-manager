import React, { createContext, useReducer, useEffect } from "react";
import { ipcRenderer } from "electron";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";
import SingletonGlobalStore from "../../GlobalStore/GlobalStore";
import { storeKeys } from "../../resources/StoreKeys/StoreKeys";
import { getApp as getFirebaseApp } from "../utils/Firebase/Firebase";
import { asyncFetchReducer, asyncFetchActions } from "../reducers/reducers";
import { useFactoryContext } from "../utils/ReactUtils/ReactUtils";
import { useFirebaseAuthObserver } from "../utils/CustomHooks/CustomHooks";

const AuthContext = createContext(null);
AuthContext.displayName = "AuthContext";

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(asyncFetchReducer, {
    data: null,
    isLoading: false,
    isLoggedIn: false,
  });
  const { user, authenticated } = useFirebaseAuthObserver();

  useEffect(() => {
    const globalStore = new SingletonGlobalStore();

    globalStore.set(storeKeys.IS_LOGGED_IN, authenticated);

    dispatch({
      type: asyncFetchActions.RECEIVE_RESPONSE,
      payload: {
        data: user,
        isLoggedIn: authenticated,
      },
    });

    if (authenticated) {
      user.getIdToken().then(token => {
        ipcRenderer.send(ipcEvents.USER_LOGIN, user.uid, token);
      });
    } else {
      ipcRenderer.send(ipcEvents.USER_LOGOUT);
    }
  }, [authenticated, user]);

  useEffect(() => {
    const registerIdTokenChangedObserver = () => {
      const firebaseApp = getFirebaseApp();

      return firebaseApp.auth().onIdTokenChanged(changedUser => {
        if (changedUser) {
          changedUser.getIdToken().then(token => {
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
