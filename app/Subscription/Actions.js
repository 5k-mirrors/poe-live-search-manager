import subscription from "./Subscription";
import * as webSocketActions from "../main/web-sockets/actions";
import { send as sendRenderer } from "../main/utils/electron-utils/electron-utils";
import { ipcEvents } from "../resources/IPCEvents/IPCEvents";
import { windows } from "../resources/Windows/Windows";
import { devLog } from "../utils/JavaScriptUtils/JavaScriptUtils";

let refreshInterval;

const refresh = id =>
  subscription
    .query(id)
    .then(nextSubscriptionDetails => {
      sendRenderer(windows.POE_SNIPER, ipcEvents.SEND_SUBSCRIPTION_DETAILS, {
        data: { ...nextSubscriptionDetails },
      });

      subscription.update(nextSubscriptionDetails);

      webSocketActions.updateConnections();
    })
    .catch(err => {
      devLog(err.message);

      sendRenderer(windows.POE_SNIPER, ipcEvents.SEND_SUBSCRIPTION_DETAILS, {
        isErr: true,
      });
    });

export const startRefreshInterval = id => {
  refresh(id);

  const oneHourInMilliseconds = 10000;

  refreshInterval = setInterval(() => {
    refresh(id);
  }, oneHourInMilliseconds);
};

export const stopRefreshInterval = () => {
  clearInterval(refreshInterval);
};
