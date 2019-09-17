import subscription from "./Subscription";
import * as webSocketActions from "../main/web-sockets/actions";

let refreshInterval;

const refresh = id => {
  subscription.query(id).then(subscriptionData => {
    subscription.update(subscriptionData);

    webSocketActions.updateConnections();
  });
};

export const startRefreshInterval = id => {
  const oneHourInMilliseconds = 3600000;

  refreshInterval = setInterval(() => {
    refresh(id);
  }, oneHourInMilliseconds);
};

export const stopRefreshInterval = () => {
  clearInterval(refreshInterval);
};
