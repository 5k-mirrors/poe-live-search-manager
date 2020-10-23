import React, { createContext, useReducer, useEffect, useRef } from "react";
import firebase from "firebase";
import { ipcRenderer } from "electron";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";
import {
  getApp as getFirebaseApp,
  ensureUserSession,
  ensureRecordExists,
} from "../utils/Firebase/Firebase";
import { asyncFetchReducer, asyncFetchActions } from "../reducers/reducers";
import { useFactoryContext } from "../utils/ReactUtils/ReactUtils";
import { useNotify } from "../utils/CustomHooks/CustomHooks";
import SessionAlreadyExists from "../../errors/session-already-exists";
import RecordNotExists from "../../errors/record-not-exists";
import {
  devErrorLog,
  retryIn,
} from "../../utils/JavaScriptUtils/JavaScriptUtils";
import packageJson from "../../../package.json";

const AuthContext = createContext(null);
AuthContext.displayName = "AuthContext";

const useAuthStateChangedObserver = showNotification => {
  const [state, dispatch] = useReducer(asyncFetchReducer, {
    data: null,
    isLoading: false,
    isLoggedIn: false,
  });

  useEffect(() => {
    const registerObserver = () => {
      dispatch({ type: asyncFetchActions.SEND_REQUEST });

      const firebaseApp = getFirebaseApp();

      return firebaseApp.auth().onAuthStateChanged(user => {
        const authenticated = !!user;

        if (authenticated) {
          ensureUserSession(user.uid)
            .then(() =>
              user.getIdToken().then(token => {
                dispatch({
                  type: asyncFetchActions.RECEIVE_RESPONSE,
                  payload: {
                    data: user,
                    isLoggedIn: true,
                  },
                });

                ipcRenderer.send(ipcEvents.USER_LOGIN, user.uid, token);

                const userRef = firebaseApp
                  .database()
                  .ref(`/users/${user.uid}`);

                return userRef
                  .onDisconnect()
                  .set({
                    is_online: false,
                    last_seen: firebase.database.ServerValue.TIMESTAMP,
                  })
                  .then(() =>
                    userRef.set({
                      is_online: true,
                      last_seen: firebase.database.ServerValue.TIMESTAMP,
                    })
                  );
              })
            )
            .catch(err => {
              devErrorLog(err);

              if (err instanceof SessionAlreadyExists) {
                showNotification(
                  "You're already logged in elsewhere. Log out or try again later.",
                  "error"
                );

                return firebaseApp
                  .auth()
                  .signOut()
                  .catch(signOutErr => {
                    devErrorLog(signOutErr);
                  });
              }

              ipcRenderer.send(ipcEvents.USER_LOGOUT);

              return showNotification(
                "Something went wrong during login.",
                "error"
              );
            });
        } else {
          dispatch({
            type: asyncFetchActions.RECEIVE_RESPONSE,
            payload: {
              data: null,
              isLoggedIn: false,
            },
          });

          ipcRenderer.send(ipcEvents.USER_LOGOUT);
        }
      });
    };

    const unregisterObserver = registerObserver();

    return () => unregisterObserver();
  }, [showNotification]);

  return { state, dispatch };
};

const useIdTokenChangedObserver = () => {
  useEffect(() => {
    const registerObserver = () => {
      const firebaseApp = getFirebaseApp();

      return firebaseApp.auth().onIdTokenChanged(user => {
        if (user) {
          user.getIdToken().then(token => {
            ipcRenderer.send(ipcEvents.ID_TOKEN_CHANGED, token);
          });
        }
      });
    };

    const unregisterObserver = registerObserver();

    return () => unregisterObserver();
  }, []);
};

const useUpdateLastActiveVersion = (authenticated, userId) => {
  const timeoutId = useRef();
  const delay = 5 * 1000;

  useEffect(() => {
    const update = () => {
      const firebaseApp = getFirebaseApp();

      return ensureRecordExists(userId)
        .then(() =>
          firebaseApp
            .firestore()
            .collection("users")
            .doc(userId)
            .update({
              last_active_version: `v${packageJson.version}`,
            })
        )
        .catch(err => {
          devErrorLog(err);

          if (err instanceof RecordNotExists) {
            timeoutId.current = retryIn(() => update(), delay);
          }
        });
    };

    if (authenticated) {
      update();
    } else {
      clearTimeout(timeoutId.current);
    }

    return () => clearTimeout(timeoutId.current);
  }, [authenticated, delay, userId]);
};

const useUpdatePresence = (authenticated, userId) => {
  const intervalId = useRef();
  const delay = 60 * 60 * 1000;

  useEffect(() => {
    if (authenticated) {
      const firebaseApp = getFirebaseApp();
      const userRef = firebaseApp.database().ref(`/users/${userId}`);

      intervalId.current = setInterval(() => {
        userRef.update({
          last_seen: firebase.database.ServerValue.TIMESTAMP,
        });
      }, delay);
    } else {
      clearInterval(intervalId.current);
    }

    return () => clearInterval(intervalId.current);
  }, [authenticated, delay, userId]);
};

export const AuthProvider = ({ children }) => {
  const { showNotification, renderNotification } = useNotify();
  const { state, dispatch } = useAuthStateChangedObserver(showNotification);
  useUpdateLastActiveVersion(state.isLoggedIn, state.data && state.data.uid);
  useUpdatePresence(state.isLoggedIn, state.data && state.data.uid);
  useIdTokenChangedObserver();

  // `onDisconnect` will fail here after `signOut`. `onDisconnect().cancel()` could be used to avoid that but it had other side effects (https://github.com/c-hive/poe-sniper/issues/359).
  const signOut = () => {
    const firebaseApp = getFirebaseApp();

    const userRef = firebaseApp.database().ref(`/users/${state.data.uid}`);

    // The `set()` operation must be performed before the user is signed out because writing attempts are rejected in case of unauthanticated users.
    return userRef
      .set({
        is_online: false,
        last_seen: firebase.database.ServerValue.TIMESTAMP,
      })
      .then(() => firebaseApp.auth().signOut())
      .then(() => {
        dispatch({
          type: asyncFetchActions.RECEIVE_RESPONSE,
          payload: {
            data: null,
            isLoggedIn: false,
          },
        });

        ipcRenderer.send(ipcEvents.USER_LOGOUT);
      })
      .catch(err => {
        devErrorLog(err);

        showNotification("Something went wrong during signout.", "error");
      });
  };

  const exportedState = {
    state,
    signOut,
  };

  return (
    <AuthContext.Provider value={exportedState}>
      {children}
      {renderNotification()}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useFactoryContext(AuthContext);
