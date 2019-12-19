import { useState, useEffect, useRef, useReducer, useCallback } from "react";
import { ipcRenderer } from "electron";
import { globalStore } from "../../../GlobalStore/GlobalStore";
import { genericAsyncActions, genericAsyncReducer } from "../../reducers";

export const useListenToDataUpdatesViaIpc = (receiver, listener) => {
  useEffect(() => {
    ipcRenderer.on(receiver, listener);

    return () => ipcRenderer.removeListener(receiver, listener);
  }, [listener, receiver]);
};

export const useRequestDataViaIpc = receiver => {
  const [state, dispatch] = useReducer(genericAsyncReducer, {
    data: null,
    isLoading: false,
    isErr: false,
  });
  useListenToDataUpdatesViaIpc(receiver, (_, payload) => {
    dispatch({ type: genericAsyncActions.END_REQUEST, payload });
  });

  const requestDataViaIpc = useCallback((requester, ...args) => {
    dispatch({ type: genericAsyncActions.BEGIN_REQUEST });

    ipcRenderer.send(requester, ...args);
  }, []);

  return [state, requestDataViaIpc];
};

export const useStoreListener = storeKey => {
  const [value, setValue] = useState(globalStore.get(storeKey));

  useEffect(() => {
    const removeListener = globalStore.onDidChange(storeKey, updatedData => {
      setValue(updatedData);
    });

    return () => {
      removeListener();
    };
  }, [storeKey]);

  return [value, setValue];
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
