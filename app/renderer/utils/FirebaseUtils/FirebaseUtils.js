import React, { useContext } from "react";
import firebase from "firebase";

const defaultFirebaseContextState = {
  app: null,
  isLoading: true,
  currentUser: null,
};

export const FirebaseContext = React.createContext({
  ...defaultFirebaseContextState,
});

export const useFirebaseContext = () => useContext(FirebaseContext);

export const getApp = () => {
  // https://stackoverflow.com/a/41005100/9599137
  if (firebase.apps.length) {
    return firebase.apps[0];
  }

  return firebase.initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
  });
};
