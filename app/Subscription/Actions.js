import subscription from "./Subscription";
import * as webSocketActions from "../backend/web-sockets/actions";

let refreshInterval;

export const refresh = id => {
  subscription.getData(id).then(subscriptionData => {
    subscription.update(subscriptionData);

    webSocketActions.updateConnections();
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
