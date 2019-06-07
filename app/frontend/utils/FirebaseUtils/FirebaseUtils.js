import firebase from "firebase/app";
import { ipcRenderer } from "electron";
import * as firebaseConfigs from "../../resources/FirebaseConfigs/FirebaseConfigs";
import { globalStore } from "../../../GlobalStore/GlobalStore";
import { storeKeys } from "../../../resources/StoreKeys/StoreKeys";
import { ipcEvents } from "../../../resources/IPCEvents/IPCEvents";
import subscription from "../../../Subscription/Subscription";

export const initializeApp = () => {
  // https://stackoverflow.com/a/41005100/9599137
  if (firebase.apps.length) {
    return firebase.apps[0];
  }

  return firebase.initializeApp(firebaseConfigs.connection);
};

export const startAuthObserver = () =>
  firebase.auth().onAuthStateChanged(user => {
    const isLoggedIn = !!user;

    globalStore.set(storeKeys.IS_LOGGED_IN, isLoggedIn);

    if (isLoggedIn) {
      subscription.refresh().then(() => {
        ipcRenderer.send(ipcEvents.USER_LOGIN);
      });
    } else {
      ipcRenderer.send(ipcEvents.USER_LOGOUT);
    }
  });
