import React, { useState, useEffect } from "react";
import ReactTooltip from "react-tooltip";
import Typograpghy from "@material-ui/core/Typography";
import { ipcRenderer } from "electron";
import { ipcEvents } from "../../../../resources/IPCEvents/IPCEvents";

const text =
  "Requests to GGG's servers are rate limited to X requests / minute / user. This is the number of available requests left in the current period. Requests are made when connecting to searches and fetching results. If you have too many searches or results there might be a delay in connecting to all the searches or displaying results.";

export default () => {
  const [remainingRequests, setRemainingRequests] = useState(0);

  useEffect(() => {
    ipcRenderer.on(ipcEvents.REMAINING_REQUESTS_UPDATE, (event, value) => {
      setRemainingRequests(value);
    });

    return () => ipcRenderer.removeAllListeners();
  });

  return (
    <div>
      <Typograpghy data-tip variant="subtitle2">
        {remainingRequests}
      </Typograpghy>
      <ReactTooltip place="bottom" type="info">
        {text}
      </ReactTooltip>
    </div>
  );
};
