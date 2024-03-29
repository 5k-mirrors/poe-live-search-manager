import React, { useState, useCallback } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const useNotify = () => {
  const [options, setOptions] = useState({
    open: false,
    text: "Notification",
    severity: "info",
  });

  const notify = useCallback((text, severity) => {
    if (!["info", "error", "warning", "success"].includes(severity)) {
      throw new Error("Unsupported severity");
    }
    setOptions({ text, severity, open: true });
  }, []);

  const Notification = () => {
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
  };

  return {
    notify,
    Notification,
  };
};

export default useNotify;
