import { useState, useEffect, useRef, useReducer, useCallback } from "react";
import { ipcRenderer } from "electron";
import { ipcActions, ipcReducer } from "../../reducers";

export const useIpc = (senderEvent, receiverEvent) => {
  const [state, dispatch] = useReducer(ipcReducer, {
    data: null,
    isLoading: false,
    isErr: false,
  });

  const listener = (_, data) => {
    dispatch({ type: ipcActions.RECEIVE_DATA, payload: data });
  };

  const send = useCallback(
    (event, ...args) => {
      dispatch({ type: ipcActions.REQUEST_DATA });

      ipcRenderer.send(event || senderEvent, ...args);
    },
    [senderEvent]
  );

  useEffect(() => {
    ipcRenderer.on(receiverEvent, listener);

    return () => ipcRenderer.removeListener(receiverEvent, listener);
  }, [receiverEvent]);

  return [state, send];
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
