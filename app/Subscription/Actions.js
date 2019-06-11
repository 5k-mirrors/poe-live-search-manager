import subscription from "./Subscription";
import * as webSocketActions from "../backend/web-sockets/actions";

let subscriptionInterval;

export const refresh = id => {
  subscription.getData(id).then(subscriptionData => {
    subscription.update(subscriptionData);

    webSocketActions.updateConnections();
  });
};

export const startSubscriptionInterval = id => {
  refresh(id);

  const oneHourInMilliseconds = 3600000;

  subscriptionInterval = setInterval(() => {
    refresh(id);
  }, oneHourInMilliseconds);
};

export const stopSubscriptionInterval = () => {
  clearInterval(subscriptionInterval);
};
