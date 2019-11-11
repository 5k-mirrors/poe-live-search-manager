/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState, useEffect } from "react";
import ReactTooltip from "react-tooltip";
import WarningIcon from "@material-ui/icons/Warning";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { ipcRenderer } from "electron";
import { ipcEvents } from "../../../../resources/IPCEvents/IPCEvents";

export default () => {
  // The default value is set to 16 to adapt to the request limiter's default value.
  const [settings, setSettings] = useState({
    requestLimit: 16,
    interval: 4,
    remainingRequests: 16,
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      ipcRenderer.send(ipcEvents.GET_REMAINING_REQUESTS);
    }, 1000);

    ipcRenderer.on(
      ipcEvents.SEND_REMAINING_REQUESTS,
      (event, currentSettings) => {
        setSettings({
          ...settings,
          ...currentSettings,
        });
      }
    );

    return () => {
      ipcRenderer.removeAllListeners();

      clearInterval(intervalId);
    };
  }, []);

  return (
    <div>
      {settings.requestLimit === 0 ? (
        <WarningIcon
          data-tip
          data-for="requestLimitFeedback"
          style={{ color: "#f7a24d" }}
        />
      ) : (
        <CheckCircleIcon
          data-tip
          data-for="requestLimitFeedback"
          style={{ color: "green" }}
        />
      )}
      <ReactTooltip
        id="requestLimitFeedback"
        place="bottom"
        type="info"
        multiline
      >
        {settings.requestLimit === 0 ? (
          <span>
            Requests to pathofexile.com are limited to<br />
            {settings.requestLimit} requests / {settings.interval} seconds / user.<br />
            Requests left in the current period: {settings.remainingRequests} / {settings.requestLimit}.<br />
            This means there may be a delay in<br />
            connecting to searches or displaying results.<br />
            Requests are made when connecting to searches<br />
            and fetching results You can try to<br />
            reduce the number of searches or results.<br />
          </span>
        ) : (
          <span>Requests to pathofexile.com are limited to {settings.requestLimit} requests / {settings.interval} seconds / user. Requests left in the current period: {settings.remainingRequests} / {settings.requestLimit}.</span>
        )}
      </ReactTooltip>
    </div>
  );
};
