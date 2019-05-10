import firebase from "firebase";
import "firebase/auth";

export const connection = {
  apiKey: process.env.API_KEY
};

export const ui = {
  signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
  callbacks: {
    signInSuccessWithAuthResult: () => false
  }
};
