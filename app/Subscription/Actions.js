import subscription from "./Subscription";
import * as webSocketActions from "../backend/web-sockets/actions";

let subscriptionInterval;

export const updateWebSocketConnections = () => {
  if (subscription.active()) {
    webSocketActions.connectToInactiveWebSockets();
  } else {
    webSocketActions.disconnectFromActiveWebSockets();
  }
};

export const startSubscriptionInterval = id => {
  subscription.refresh(id);

  const oneHourInMilliseconds = 5000;

  subscriptionInterval = setInterval(() => {
    subscription.refresh(id);
  }, oneHourInMilliseconds);
};

export const stopSubscriptionInterval = () => {
  clearInterval(subscriptionInterval);
};
