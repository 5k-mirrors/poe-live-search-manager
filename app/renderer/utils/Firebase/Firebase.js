import firebase from "firebase";
import { ipcRenderer } from "electron";
import { ipcEvents } from "../../../resources/IPCEvents/IPCEvents";
import { globalStore } from "../../../GlobalStore/GlobalStore";
import { storeKeys } from "../../../resources/StoreKeys/StoreKeys";

export const getApp = () => {
  // https://stackoverflow.com/a/41005100/9599137
  if (firebase.apps.length) {
    return firebase.apps[0];
  }

  return firebase.initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
  });
};

export const registerUserAuthObserver = () => {
  const firebaseApp = getApp();

  return firebaseApp.auth().onAuthStateChanged(user => {
    const isLoggedIn = !!user;

    globalStore.set(storeKeys.IS_LOGGED_IN, isLoggedIn);

    if (isLoggedIn) {
      ipcRenderer.send(ipcEvents.USER_LOGIN, user.uid);
    } else {
      ipcRenderer.send(ipcEvents.USER_LOGOUT);
    }
  });
};
