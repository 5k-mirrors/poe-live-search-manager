import React, { createContext, useReducer, useEffect, useRef } from "react";
import firebase from "firebase";
import { ipcRenderer } from "electron";
import { ipcEvents } from "../../shared/resources/IPCEvents/IPCEvents";
import { asyncFetchReducer, asyncFetchActions } from "../reducers/reducers";
import { useFactoryContext } from "../utils/ReactUtils/ReactUtils";
import { useNotify } from "../utils/CustomHooks/CustomHooks";
import SessionAlreadyExists from "../../shared/errors/session-already-exists";
import RecordNotExists from "../../shared/errors/record-not-exists";
import {
  devErrorLog,
  retryIn,
} from "../../shared/utils/JavaScriptUtils/JavaScriptUtils";
import packageJson from "../../../package.json";

const AuthContext = createContext(null);
AuthContext.displayName = "AuthContext";

export const AuthProvider = ({ children }) => {
  const { showNotification, renderNotification } = useNotify();

  // `onDisconnect` will fail here after `signOut`. `onDisconnect().cancel()` could be used to avoid that but it had other side effects (https://github.com/c-hive/poe-sniper/issues/359).
  const signOut = () => {
    // The `set()` operation must be performed before the user is signed out because writing attempts are rejected in case of unauthanticated users.
  };

  const state = {
    data: null,
    isLoading: false,
    isLoggedIn: false,
  };

  const exportedState = {
    state,
    signOut,
  };

  return (
    <AuthContext.Provider value={exportedState}>
      {children}
      {renderNotification()}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useFactoryContext(AuthContext);
