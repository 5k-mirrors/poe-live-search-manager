import firebase from "firebase/app";

export const config = {
  apiKey: process.env.API_KEY
};

export const uiConfig = {
  signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID]
};
