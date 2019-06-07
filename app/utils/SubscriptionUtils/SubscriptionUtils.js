import { globalStore } from "../../GlobalStore/GlobalStore";
import { storeKeys } from "../../resources/StoreKeys/StoreKeys";
import baseApiUrl from "../../frontend/resources/BaseApiUrl/BaseApiUrl";
import * as javaScripUtils from "../JavaScriptUtils/JavaScriptUtils";

// TODO: error handling?
export const get = id => {
  const userApiUrl = `${baseApiUrl}/user/${id}`;

  return fetch(userApiUrl)
    .then(userSubscriptionDetails => userSubscriptionDetails.json())
    .then(parsedSubscriptionDetails => parsedSubscriptionDetails);
};

export const save = id => {
  get(id).then(data => {
    globalStore.set(storeKeys.SUBSCRIPTION, data);
  });
};

export const isActive = () => {
  const subscriptionData = globalStore.get(storeKeys.SUBSCRIPTION, {});

  if (javaScripUtils.isDefined(subscriptionData.paying)) {
    return subscriptionData.paying;
  }

  return false;
};
