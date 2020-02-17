import firebase from "firebase";
import SessionAlreadyExists from "../../../errors/session-already-exists";

export const getApp = () => {
  // https://stackoverflow.com/a/41005100/9599137
  if (firebase.apps.length) {
    return firebase.apps[0];
  }

  return firebase.initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
};

export const ensureUserSession = userId => {
  const firebaseApp = getApp();

  const userRef = firebaseApp.database().ref(`/users/${userId}`);

  return userRef.once("value").then(snapshot => {
    if (!snapshot.exists()) {
      return userRef.set({
        is_online: true,
        last_seen: firebase.database.ServerValue.TIMESTAMP,
      });
    }

    const user = snapshot.val();

    if (user.is_online) {
      throw new SessionAlreadyExists(`${userId} already has an active session`);
    }

    return Promise.resolve();
  });
};
