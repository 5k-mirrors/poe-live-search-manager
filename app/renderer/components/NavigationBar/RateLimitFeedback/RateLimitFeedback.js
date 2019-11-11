/* eslint-disable prettier/prettier */
/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState, useEffect } from "react";
import ReactTooltip from "react-tooltip";
import WarningIcon from "@material-ui/icons/Warning";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { ipcRenderer } from "electron";
import { ipcEvents } from "../../../../resources/IPCEvents/IPCEvents";
import tooltipIds from "../../../resources/TooltipIds/TooltipIds";
import requestLimiterDefaultValues from "../../../../resources/RequestLimiterDefaultSettings/RequestLimiterDefaultSettings";

export default () => {
  const [settings, setSettings] = useState({
    requestLimit: requestLimiterDefaultValues.requestLimit,
    interval: requestLimiterDefaultValues.interval,
    remainingRequests: requestLimiterDefaultValues.requestLimit,
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
      clearInterval(intervalId);

      ipcRenderer.removeAllListeners();
    };
  }, []);

  function requestsAreDenied() {
    return settings.remainingRequests === 0;
  }

  function buildMessage() {
    if (requestsAreDenied()) {
      return (
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
      );
    }

    return (
      <span>
        Requests to pathofexile.com are limited to {settings.requestLimit}requests /{settings.interval} seconds / user.<br />
        Requests left in the current period: {settings.remainingRequests} / {settings.requestLimit}.
      </span>
    );
  }

  return (
    <div>
      {requestsAreDenied() ? (
        <div data-tip data-for={tooltipIds.RATE_LIMIT_FEEDBACK}>
          <WarningIcon style={{ color: "#F7A24D" }} />
        </div>
      ) : (
        <div data-tip data-for={tooltipIds.RATE_LIMIT_FEEDBACK}>
          <CheckCircleIcon style={{ color: "#228B22" }} />
        </div>
      )}
      <ReactTooltip
        id={tooltipIds.RATE_LIMIT_FEEDBACK}
        place="bottom"
        type={requestsAreDenied() ? "warning" : "info"}
        multiline
      >
        {buildMessage()}
      </ReactTooltip>
    </div>
  );
};
