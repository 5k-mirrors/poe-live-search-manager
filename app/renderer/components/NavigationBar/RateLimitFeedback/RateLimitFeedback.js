import React, { useState, useEffect } from "react";
import ReactTooltip from "react-tooltip";
import WarningIcon from "@material-ui/icons/Warning";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { ipcRenderer } from "electron";
import { ipcEvents } from "../../../../resources/IPCEvents/IPCEvents";
import tooltipIds from "../../../resources/TooltipIds/TooltipIds";

export default () => {
  const [requestsExhausted, setRequestsExhausted] = useState(false);

  function rateLimitStatusChangeListener(event, currentStatus) {
    setRequestsExhausted(currentStatus);
  }

  useEffect(() => {
    ipcRenderer.on(
      ipcEvents.RATE_LIMIT_STATUS_CHANGE,
      rateLimitStatusChangeListener
    );

    return () =>
      ipcRenderer.removeListener(
        ipcEvents.RATE_LIMIT_STATUS_CHANGE,
        rateLimitStatusChangeListener
      );
  }, []);

  function buildMessage() {
    if (requestsExhausted) {
      return (
        <span>
          Requests reached rate limit. There may be a delay in displaying
          results. You can try to reduce the number of searches or results.
        </span>
      );
    }

    return <span>Requests within rate limit.</span>;
  }

  return (
    <div>
      {requestsExhausted ? (
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
        type={requestsExhausted ? "warning" : "info"}
        multiline
      >
        {buildMessage()}
      </ReactTooltip>
    </div>
  );
};
