import firebase from "firebase";
import "firebase/auth";

export const ui = {
  signInOptions: [
    {
      provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      requireDisplayName: false,
    },
  ],
  callbacks: {
    signInSuccessWithAuthResult: () => false,
  },
};
