import subscription from "./Subscription";
import * as webSocketActions from "../backend/web-sockets/actions";

let subscriptionInterval;

export const updateWebSocketConnections = () => {
  if (subscription.active()) {
    return webSocketActions.connectToStoredWebSockets();
  }

  return webSocketActions.disconnectFromStoredWebSockets();
};

export const refreshData = id =>
  subscription.getData(id).then(subscriptionData => {
    subscription.update(subscriptionData);

    updateWebSocketConnections();

    return subscriptionData;
  });

export const startSubscriptionInterval = id => {
  refreshData(id);

  const oneHourInMilliseconds = 5000;

  subscriptionInterval = setInterval(() => {
    refreshData(id);
  }, oneHourInMilliseconds);
};

export const stopSubscriptionInterval = () => {
  clearInterval(subscriptionInterval);
};
