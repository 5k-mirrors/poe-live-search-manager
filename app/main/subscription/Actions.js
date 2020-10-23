import Subscription from "./Subscription";
import * as webSocketActions from "../web-sockets/actions";
import { send as sendEvent } from "../utils/electron-utils/electron-utils";
import { ipcEvents } from "../../shared/resources/IPCEvents/IPCEvents";
import { windows } from "../../shared/resources/Windows/Windows";
import {
  devErrorLog,
  randomInt,
} from "../../shared/utils/JavaScriptUtils/JavaScriptUtils";

let refreshInterval;

export const refresh = () =>
  Subscription.query()
    .then(nextSubscriptionDetails => {
      Subscription.update(nextSubscriptionDetails);
      webSocketActions.updateConnections();
      return Subscription.data;
    })
    .catch(err => {
      devErrorLog("Subscription refresh error: ", err);
      throw err;
    });

const refreshAndNotify = () => {
  refresh()
    .then(subscriptionData => {
      sendEvent(windows.MAIN, ipcEvents.UPDATE_SUBSCRIPTION_DETAILS, {
        data: { ...subscriptionData },
      });
    })
    .catch(() => {
      sendEvent(windows.MAIN, ipcEvents.UPDATE_SUBSCRIPTION_DETAILS, {
        isErr: true,
      });
    });
};

export const startRefreshInterval = () => {
  refreshAndNotify();

  const minutes = 60 * 1000;
  // The delay is randomly set because the authenticated ID tokens are hourly refreshed as well and requests with expired tokens cannot be fulfilled.
  const delay = randomInt(65 * minutes, 70 * minutes);

  refreshInterval = setInterval(() => {
    refreshAndNotify();
  }, delay);
};

export const stopRefreshInterval = () => {
  clearInterval(refreshInterval);
};
