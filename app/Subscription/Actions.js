import subscription from "./Subscription";
import * as webSocketActions from "../backend/web-sockets/actions";

let subscriptionIntervalTimer;

export const checkIfSubscriptionIsActive = () => {
  if (subscription.active()) {
    return webSocketActions.connectToStoredWebSockets();
  }

  return webSocketActions.disconnectFromStoredWebSockets();
};

export const startSubscriptionInterval = id => {
  const oneHourInMilliseconds = 3600000;

  subscriptionIntervalTimer = setInterval(() => {
    return subscription.getData(id).then(subscriptionData => {
      subscription.update(subscriptionData);

      checkIfSubscriptionIsActive();
    });
  }, oneHourInMilliseconds);
};

export const clearSubscriptionInterval = () => {
  clearInterval(subscriptionIntervalTimer);

  webSocketActions.disconnectFromStoredWebSockets();
};
