import { useState, useEffect, useRef, useReducer, useCallback } from "react";
import { ipcRenderer } from "electron";
import { asyncFetchActions, asyncFetchReducer } from "../../reducers/reducers";
import { getApp as getFirebaseApp } from "../Firebase/Firebase";

export const useListenToDataUpdatesViaIpc = (receiver, listener) => {
  useEffect(() => {
    ipcRenderer.on(receiver, listener);

    return () => ipcRenderer.removeListener(receiver, listener);
  }, [listener, receiver]);
};

export const useRequestDataViaIpc = receiver => {
  const [state, dispatch] = useReducer(asyncFetchReducer, {
    data: null,
    isLoading: false,
    isErr: false,
  });

  const listener = useCallback((_, payload) => {
    dispatch({ type: asyncFetchActions.RECEIVE_RESPONSE, payload });
  }, []);

  useListenToDataUpdatesViaIpc(receiver, listener);

  const requestDataViaIpc = useCallback((requester, ...args) => {
    dispatch({ type: asyncFetchActions.SEND_REQUEST });

    ipcRenderer.send(requester, ...args);
  }, []);

  return [state, requestDataViaIpc];
};

export const useDisable = seconds => {
  const timeoutId = useRef();
  const [isDisabled, setIsDisabled] = useState(false);

  function disable() {
    setIsDisabled(previousIsDisabled => !previousIsDisabled);

    const oneSecondInMilliseconds = 1000;

    timeoutId.current = setTimeout(() => {
      setIsDisabled(previousIsDisabled => !previousIsDisabled);
    }, seconds * oneSecondInMilliseconds);
  }

  useEffect(() => () => clearTimeout(timeoutId.current), []);

  return [isDisabled, disable];
};

export const useDisplay = () => {
  const [elementIsVisible, setShowElement] = useState(false);

  const timeout = useRef(null);

  useEffect(() => {
    return () => clearTimeout(timeout.current);
  }, [timeout]);

  const displayElement = () => setShowElement(true);

  const hideElementAfterMsElapsed = milliseconds => {
    timeout.current = setTimeout(() => {
      setShowElement(false);
    }, milliseconds);
  };

  return [elementIsVisible, displayElement, hideElementAfterMsElapsed];
};

export const useFirebaseAuthObserver = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const registerAuthStateChangedObserver = () => {
      const firebaseApp = getFirebaseApp();

      return firebaseApp.auth().onAuthStateChanged(changedUser => {
        setUser(changedUser);
      });
    };

    const unregisterAuthStateChangedObserver = registerAuthStateChangedObserver();

    return () => unregisterAuthStateChangedObserver();
  }, []);

  return { user, authenticated: !!user };
};
