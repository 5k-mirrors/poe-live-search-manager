import firebase from "firebase/app";
import * as FirebaseConfigs from "../../resources/FirebaseConfigs/FirebaseConfigs";
import { globalStore } from "../../../GlobalStore/GlobalStore";

export const initializeApp = () => {
  // https://stackoverflow.com/a/41005100/9599137
  if (firebase.apps.length) {
    return firebase.apps[0];
  }

  return firebase.initializeApp(FirebaseConfigs.connection);
};

export const startAuthObserver = () =>
  firebase.auth().onAuthStateChanged(user => {
    const isLoggedIn = !!user;

    globalStore.set("isLoggedIn", isLoggedIn);
  });
