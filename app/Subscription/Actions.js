import subscription from "./Subscription";
import * as webSocketActions from "../main/web-sockets/actions";
import { send as sendRenderer } from "../main/utils/electron-utils/electron-utils";
import { ipcEvents } from "../resources/IPCEvents/IPCEvents";
import { windows } from "../resources/Windows/Windows";
import {
  devErrorLog,
  randomInt,
} from "../utils/JavaScriptUtils/JavaScriptUtils";

let refreshInterval;

export const refresh = () =>
  subscription
    .query()
    .then(nextSubscriptionDetails => {
      subscription.update(nextSubscriptionDetails);

      sendRenderer(windows.MAIN, ipcEvents.SEND_SUBSCRIPTION_DETAILS, {
        data: { ...subscription.data },
      });

      webSocketActions.updateConnections();
    })
    .catch(err => {
      devErrorLog("Subscription refresh error: ", err);

      sendRenderer(windows.MAIN, ipcEvents.SEND_SUBSCRIPTION_DETAILS, {
        isErr: true,
      });
    });

export const startRefreshInterval = () => {
  refresh();

  const minutes = 60 * 1000;
  // The delay is randomly set because the authenticated ID tokens are hourly refreshed as well and requests with expired tokens cannot be fulfilled.
  const delay = randomInt(65 * minutes, 70 * minutes);

  refreshInterval = setInterval(() => {
    refresh();
  }, delay);
};

export const stopRefreshInterval = () => {
  clearInterval(refreshInterval);
};
