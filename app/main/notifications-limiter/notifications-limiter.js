import Bottleneck from "bottleneck";
import * as javaScriptUtils from "../../utils/JavaScriptUtils/JavaScriptUtils";

class NotificationsLimiter {
  constructor() {
    // The limit is set to Windows default 5 seconds.
    // https://www.pcworld.com/article/3054228/how-to-make-windows-10-notifications-last-a-little-or-a-lot-longer.html
    this.instance = new Bottleneck({
      maxConcurrent: 1,
      minTime: 5000,
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

  getLimiter() {
    return this.instance;
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
