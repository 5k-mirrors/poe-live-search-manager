import firebase from "firebase";

export default () => {
  // https://stackoverflow.com/a/41005100/9599137
  if (firebase.apps.length) {
    return firebase.apps[0];
  }

  return firebase.initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
  });
};
