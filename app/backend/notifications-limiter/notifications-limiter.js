import Bottleneck from "bottleneck";
import { globalStore } from "../../GlobalStore/GlobalStore";
import { storeKeys } from "../../resources/StoreKeys/StoreKeys";

const getMinTime = () => {
  const oneSecondInMilliseconds = 1000;

  const notificationsInterval = globalStore.get(
    storeKeys.NOTIFICATIONS_INTERVAL,
    3
  );

  return notificationsInterval * oneSecondInMilliseconds;
};

export const get = () => {
  const limiter = new Bottleneck({
    maxConcurrent: 1,
    minTime: getMinTime()
  });

  return limiter;
};
