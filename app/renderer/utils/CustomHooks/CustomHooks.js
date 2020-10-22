import React, { useState, useEffect, useRef, useCallback } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

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

export const useNotify = () => {
  const [options, setOptions] = useState({
    open: false,
    text: "Something went wrong.",
    severity: "error",
  });

  const showNotification = useCallback(
    (text = options.text, severity = options.severity) => {
      setOptions(prevOptions => ({
        ...prevOptions,
        text,
        severity,
        open: true,
      }));
    },
    [options.severity, options.text]
  );

  function renderNotification() {
    return (
      <Snackbar
        open={options.open}
        autoHideDuration={4000}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        onClose={() =>
          setOptions(prevOptions => ({ ...prevOptions, open: false }))
        }
      >
        <Alert
          severity={options.severity}
          variant="filled"
          onClose={() =>
            setOptions(prevOptions => ({ ...prevOptions, open: false }))
          }
        >
          {options.text}
        </Alert>
      </Snackbar>
    );
  }

  return {
    showNotification,
    renderNotification,
  };
};
