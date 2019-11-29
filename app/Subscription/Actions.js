import subscription from "./Subscription";
import * as webSocketActions from "../main/web-sockets/actions";
import { send as sendRenderer } from "../main/utils/electron-utils/electron-utils";
import { ipcEvents } from "../resources/IPCEvents/IPCEvents";
import { windows } from "../resources/Windows/Windows";

let refreshInterval;

const subscriptionUpdated = (
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
  subscription.query(id).then(nextSubscriptionDetails => {
    const prevSubscriptionDetails = {
      ...subscription.data,
    };

    if (subscriptionUpdated(prevSubscriptionDetails, nextSubscriptionDetails)) {
      sendRenderer(windows.POE_SNIPER, ipcEvents.REFRESH_SUBSCRIPTION_DETAILS, {
        data: nextSubscriptionDetails,
      });

      subscription.update(nextSubscriptionDetails);

      webSocketActions.updateConnections();
    }
  });
  /* .catch(err => {
      devLog(`Subscription fetch error: ${err}`);

      sendRenderer(windows.POE_SNIPER, ipcEvents.REFRESH_SUBSCRIPTION_DETAILS, {
        isErr: true,
      });
    }); */
};

export const startRefreshInterval = id => {
  refresh(id);

  const oneHourInMilliseconds = 100000;

  refreshInterval = setInterval(() => {
    refresh(id);
  }, oneHourInMilliseconds);
};

export const stopRefreshInterval = () => {
  clearInterval(refreshInterval);
};
