import React, { useState, useEffect } from "react";
import ReactTooltip from "react-tooltip";
import WarningIcon from "@material-ui/icons/Warning";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { ipcRenderer } from "electron";
import { ipcEvents } from "../../../../resources/IPCEvents/IPCEvents";
import tooltipIds from "../../../resources/TooltipIds/TooltipIds";

export default () => {
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    /* ipcRenderer.on(ipcEvents.RATE_LIMIT_CHANGE, (event, details) => {
      setIsActive(details.isActive);
    }); */

    /* ipcRenderer.on(
      ipcEvents.SEND_RATE_LIMIT_STATUS,
      (event, rateLimitIsActive) => {
        console.log("[rateLimitIsActive]", rateLimitIsActive);

        setIsActive(rateLimitIsActive);
      }
    );

    setInterval(() => {
      ipcRenderer.send(ipcEvents.GET_RATE_LIMIT_STATUS);
    }, 2000); */

    return () => {
      // clearInterval(intervalId);
      // ipcRenderer.removeAllListeners();
    };
  }, []);

  function buildMessage() {
    if (isActive) {
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
      {isActive ? (
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
        type={isActive ? "warning" : "info"}
        multiline
      >
        {buildMessage()}
      </ReactTooltip>
    </div>
  );
};
