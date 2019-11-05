import Bottleneck from "bottleneck";
import fetch from "node-fetch";
import getCookieHeader from "../utils/get-cookie-header/get-cookie-header";
import MissingXRateLimitAccountHeaderError from "../../errors/missing-x-rate-limit-account-header-error";
import * as baseUrls from "../../resources/BaseUrls/BaseUrls";
import * as javaScriptUtils from "../../utils/JavaScriptUtils/JavaScriptUtils";
import headerKeys from "../../resources/HeaderKeys/HeaderKeys";

class RequestLimiter {
  constructor() {
    this.defaulValues = {
      limit: 16,
      interval: 4000,
    };

    this.instance = new Bottleneck({
      maxConcurrent: 1,
      minTime: 333,
    });
  }

  initialize() {
    return this.initialFetch()
      .then(({ requestLimit, interval }) => {
        javaScriptUtils.devLog(`REQUEST LIMIT - ${requestLimit}`);
        javaScriptUtils.devLog(`INTERVAL - ${interval}`);

        return this.instance.updateSettings({
          reservoir: requestLimit,
          reservoirRefreshAmount: requestLimit,
          reservoirRefreshInterval: interval,
        });
      })
      .catch(err => {
        javaScriptUtils.devLog(
          `RATE LIMIT INIT ERROR - ${JSON.stringify(err)}`
        );

        return this.instance.updateSettings({
          reservoir: this.defaulValues.limit,
          reservoirRefreshAmount: this.defaulValues.limit,
          reservoirRefreshInterval: this.defaulValues.interval,
        });
      });
  }

  initialFetch = () => {
    return fetch(`${baseUrls.poeFetchAPI}1`, {
      headers: {
        Cookie: getCookieHeader(),
      },
    }).then(response => {
      if (response.headers.has(headerKeys.XRateLimitAccount)) {
        const xRateLimitAccountValues = response.headers
          .get(headerKeys.XRateLimitAccount)
          .split(":");

        return {
          requestLimit: xRateLimitAccountValues[0],
          interval: xRateLimitAccountValues[1] * 1000,
        };
      }

      throw new MissingXRateLimitAccountHeaderError();
    });
  };

  get() {
    return this.instance;
  }
}

class SingletonRequestLimiter {
  constructor() {
    if (!SingletonRequestLimiter.instance) {
      SingletonRequestLimiter.instance = new RequestLimiter();
    }

    return SingletonRequestLimiter.instance;
  }
}

export default new SingletonRequestLimiter();
