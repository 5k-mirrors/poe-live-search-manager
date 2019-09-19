import Bottleneck from "bottleneck";
import * as javaScriptUtils from "../../utils/JavaScriptUtils/JavaScriptUtils";

class ResultYieldLimiter {
  constructor() {
    // The limit is set to 7500ms to align with Windows notifications(5 seconds by default, but the notification's effect lasts for ~2500 ms).
    // https://www.pcworld.com/article/3054228/how-to-make-windows-10-notifications-last-a-little-or-a-lot-longer.html
    this.instance = new Bottleneck({
      maxConcurrent: 1,
      minTime: 7500,
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

class SingletonResultYieldLimiter {
  constructor() {
    if (!javaScriptUtils.isDefined(SingletonResultYieldLimiter.instance)) {
      SingletonResultYieldLimiter.instance = new ResultYieldLimiter();
    }

    return SingletonResultYieldLimiter.instance;
  }
}

const singletonResultYieldLimiter = new SingletonResultYieldLimiter();

export default singletonResultYieldLimiter;
