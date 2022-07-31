import React, { useEffect, useCallback } from "react";
import { ipcRenderer } from "electron";

import useNotify from "../utils/useNotify";
import { ipcEvents } from "../../shared/resources/IPCEvents/IPCEvents";

const ErrorNotification = () => {
  const { notify, Notification } = useNotify();

  const errorListener = useCallback(
    (_event, message) => {
      return notify(message, "error");
    },
    [notify]
  );

  useEffect(() => {
    ipcRenderer.on(ipcEvents.ERROR, errorListener);

    return () => {
      ipcRenderer.removeListener(ipcEvents.ERROR, errorListener);
    };
  }, [errorListener]);

  return <Notification />;
};

export default ErrorNotification;
