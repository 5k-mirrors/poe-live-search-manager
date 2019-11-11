import React, { useState, useEffect } from "react";
import Typograpghy from "@material-ui/core/Typography";
import { ipcRenderer } from "electron";
import { ipcEvents } from "../../../../resources/IPCEvents/IPCEvents";

export default () => {
  const [remainingReservoir, setRemainingReservoir] = useState(0);

  useEffect(() => {
    ipcRenderer.on(ipcEvents.REMAINING_REQUESTS_UPDATE, (event, value) => {
      setRemainingReservoir(value);
    });

    return () => ipcRenderer.removeAllListeners();
  });

  return (
    <div>
      <Typograpghy variant="subtitle2">{remainingReservoir}</Typograpghy>
    </div>
  );
};
