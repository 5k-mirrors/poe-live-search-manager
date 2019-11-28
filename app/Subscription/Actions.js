import subscription from "./Subscription";
import * as webSocketActions from "../main/web-sockets/actions";
import { send as sendRenderer } from "../main/utils/electron-utils/electron-utils";
import { ipcEvents } from "../resources/IPCEvents/IPCEvents";
import { windows } from "../resources/Windows/Windows";

let refreshInterval;

export const subscriptionUpdated = (
  prevSubscriptionDetails,
  nextSubscriptionDetails
) => {
  const payingStatusChanged =
    prevSubscriptionDetails.paying !== nextSubscriptionDetails.paying;
  const subscriptionTypeChanged =
    prevSubscriptionDetails.subscription_type !==
    nextSubscriptionDetails.subscription_type;

  return payingStatusChanged || subscriptionTypeChanged;
};

const refresh = id => {
  subscription.query(id).then(subscriptionData => {
    if (subscriptionUpdated(subscription.data, subscriptionData)) {
      sendRenderer(windows.POE_SNIPER, ipcEvents.SUBSCRIPTION_UPDATE_IN_MAIN, {
        ...subscriptionData,
      });
    }

    subscription.update(subscriptionData);

    webSocketActions.updateConnections();
  });
};

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
