import React, { createContext, useReducer, useEffect, useRef } from "react";
import firebase from "firebase";
import { ipcRenderer } from "electron";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";
import {
  getApp as getFirebaseApp,
  ensureUserSession,
} from "../utils/Firebase/Firebase";
import { asyncFetchReducer, asyncFetchActions } from "../reducers/reducers";
import { useFactoryContext } from "../utils/ReactUtils/ReactUtils";
import { useNotify } from "../utils/CustomHooks/CustomHooks";
import SessionAlreadyExists from "../../errors/session-already-exists";
import { devErrorLog } from "../../utils/JavaScriptUtils/JavaScriptUtils";

const AuthContext = createContext(null);
AuthContext.displayName = "AuthContext";

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(asyncFetchReducer, {
    data: null,
    isLoading: false,
    isLoggedIn: false,
  });
  const { showNotification, renderNotification } = useNotify();
  const intervalId = useRef();
  const userPresenceUpdateDelay = 3600000;

  useEffect(() => {
    const registerAuthStateChangedObserver = () => {
      dispatch({ type: asyncFetchActions.SEND_REQUEST });

      const firebaseApp = getFirebaseApp();

      return firebaseApp.auth().onAuthStateChanged(user => {
        const userAuthenticated = !!user;

        if (userAuthenticated) {
          ensureUserSession(user.uid)
            .then(() => {
              dispatch({
                type: asyncFetchActions.RECEIVE_RESPONSE,
                payload: {
                  data: user,
                  isLoggedIn: true,
                },
              });

              return user.getIdToken().then(token => {
                ipcRenderer.send(ipcEvents.USER_LOGIN, user.uid, token);

                const userRef = firebaseApp
                  .database()
                  .ref(`/users/${user.uid}`);

                intervalId.current = setInterval(() => {
                  userRef.set({
                    is_online: true,
                    last_seen: firebase.database.ServerValue.TIMESTAMP,
                  });
                }, userPresenceUpdateDelay);

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
              });
            })
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

          if (intervalId.current) {
            clearInterval(intervalId.current);
          }
        }
      });
    };

    const unregisterAuthStateChangedObserver = registerAuthStateChangedObserver();

    return () => {
      unregisterAuthStateChangedObserver();

      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, [showNotification]);

  useEffect(() => {
    const registerIdTokenChangedObserver = () => {
      const firebaseApp = getFirebaseApp();

      return firebaseApp.auth().onIdTokenChanged(user => {
        if (user) {
          user.getIdToken().then(token => {
            ipcRenderer.send(ipcEvents.ID_TOKEN_CHANGED, token);
          });
        }
      });
    };

    const unregisterIdTokenChangedObserver = registerIdTokenChangedObserver();

    return () => unregisterIdTokenChangedObserver();
  }, []);

  const signOut = () => {
    const firebaseApp = getFirebaseApp();

    const userRef = firebaseApp.database().ref(`/users/${state.data.uid}`);

    return (
      userRef
        .onDisconnect()
        // Cancelling the event which was set after the user has signed in avoids updating the database in unauthenticated status.
        .cancel()
        .then(() =>
          // The `set()` operation must be performed before the user is signed out because writing attempts are rejected in case of unauthanticated users.
          userRef.set({
            is_online: false,
            last_seen: firebase.database.ServerValue.TIMESTAMP,
          })
        )
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
        })
    );
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
