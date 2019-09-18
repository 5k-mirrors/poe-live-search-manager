import Bottleneck from "bottleneck";
import * as javaScriptUtils from "../../utils/JavaScriptUtils/JavaScriptUtils";
import { globalStore } from "../../GlobalStore/GlobalStore";
import { storeKeys } from "../../resources/StoreKeys/StoreKeys";

class NotificationsLimiter {
  constructor() {
    this.instance = new Bottleneck({
      maxConcurrent: 1,
      minTime: 3000,
    });

    this.instance.on("error", error => {
      // eslint-disable-next-line no-console
      console.error(JSON.stringify(error));
    });

    this.instance.on("failed", (error, jobInfo) => {
      // eslint-disable-next-line no-console
      console.error(`${jobInfo.options.id} failed. ${JSON.stringify(error)}`);
    });
  }

  getMinTime = () => {
    const oneSecondInMilliseconds = 1000;

    const notificationsInterval = globalStore.get(
      storeKeys.NOTIFICATIONS_INTERVAL,
      3
    );

    return notificationsInterval * oneSecondInMilliseconds;
  };

  getLimiter() {
    return this.instance;
  }

  refreshMinTime() {
    this.instance.updateSettings({
      minTime: this.getMinTime(),
    });
  }
}

class SingletonNotificationsLimiter {
  constructor() {
    if (!javaScriptUtils.isDefined(SingletonNotificationsLimiter.instance)) {
      SingletonNotificationsLimiter.instance = new NotificationsLimiter();
    }

    return SingletonNotificationsLimiter.instance;
  }
}

const singletonNotificationsLimiter = new SingletonNotificationsLimiter();

export default singletonNotificationsLimiter;
