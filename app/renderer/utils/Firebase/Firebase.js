import firebase from "firebase";
import RecordNotExists from "../../../errors/record-not-exists";
import { devLog } from "../../../utils/JavaScriptUtils/JavaScriptUtils";

export const getApp = () => {
  // https://stackoverflow.com/a/41005100/9599137
  if (firebase.apps.length) {
    return firebase.apps[0];
  }

  return firebase.initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
  });
};

export const ensureUserSession = userId => {
  const firebaseApp = getApp();

  const userRef = firebaseApp.database().ref(`/users/${userId}`);

  return userRef.once("value").then(snapshot => {
    if (!snapshot.exists()) {
      return userRef.set({
        last_seen: firebase.database.ServerValue.TIMESTAMP,
      });
    }

    const user = snapshot.val();

    if (user.is_online) {
      devLog(`User session checking temporarily disabled.`);
      // throw new SessionAlreadyExists(`${userId} already has an active session`);
    }

    return Promise.resolve();
  });
};

export const ensureRecordExists = userId => {
  const firebaseApp = getApp();

  return firebaseApp
    .firestore()
    .collection("users")
    .doc(userId)
    .get()
    .then(doc => {
      if (!doc.exists) {
        throw new RecordNotExists(`${userId} not exists`);
      }

      return Promise.resolve();
    });
};
