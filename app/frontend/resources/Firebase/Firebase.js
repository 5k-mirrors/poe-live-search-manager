import firebase from "firebase";
import "firebase/auth";

export const config = {
  apiKey: process.env.API_KEY
};

export const uiConfig = {
  signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
  callbacks: {
    signInSuccessWithAuthResult: () => false
  }
};
