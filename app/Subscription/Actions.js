import subscription from "./Subscription";
import * as webSocketActions from "../main/web-sockets/actions";
import { send as sendRenderer } from "../main/utils/electron-utils/electron-utils";
import { ipcEvents } from "../resources/IPCEvents/IPCEvents";
import { windows } from "../resources/Windows/Windows";

let refreshInterval;

const refresh = id => {
  subscription
    .query(id)
    .then(nextSubscriptionDetails => {
      sendRenderer(
        windows.POE_SNIPER,
        ipcEvents.SEND_SUBSCRIPTION_DETAILS,
        nextSubscriptionDetails
      );

      subscription.update(nextSubscriptionDetails);

      webSocketActions.updateConnections();
    })
    .catch(err => {
      // @TODO Handle errors ...
      console.error(`Subscription fetch error: ${err}`);
    });
};

export const startRefreshInterval = id => {
  refresh(id);

  const oneHourInMilliseconds = 3600000;

  refreshInterval = setInterval(() => {
    refresh(id);
  }, oneHourInMilliseconds);
};

export const stopRefreshInterval = () => {
  clearInterval(refreshInterval);
};
