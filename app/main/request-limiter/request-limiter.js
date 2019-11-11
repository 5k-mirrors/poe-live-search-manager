import Bottleneck from "bottleneck";
import fetch from "node-fetch";
import getCookieHeader from "../utils/get-cookie-header/get-cookie-header";
import MissingXRateLimitAccountHeaderError from "../../errors/missing-x-rate-limit-account-header-error";
import * as baseUrls from "../../resources/BaseUrls/BaseUrls";
import * as javaScriptUtils from "../../utils/JavaScriptUtils/JavaScriptUtils";
import headerKeys from "../../resources/HeaderKeys/HeaderKeys";
import requestLimiterDefaultSettings from "../../resources/RequestLimiterDefaultSettings/RequestLimiterDefaultSettings";

class RequestLimiter {
  constructor() {
    this.settings = {
      requestLimit: requestLimiterDefaultSettings.requestLimit,
      interval: requestLimiterDefaultSettings.interval,
    };

    this.instance = new Bottleneck({
      maxConcurrent: 1,
      minTime: 333,
    });
  }

  initialize() {
    return this.initialFetch()
      .then(({ requestLimit, interval }) => {
        javaScriptUtils.devLog(
          `Requests are limited to ${requestLimit} requests / ${interval} seconds.`
        );

        this.settings = {
          ...this.settings,
          requestLimit,
          interval,
        };

        return this.instance.updateSettings({
          reservoir: requestLimit,
          reservoirRefreshAmount: requestLimit,
          reservoirRefreshInterval: interval * 1000,
        });
      })
      .catch(err => {
        javaScriptUtils.devLog(
          `RATE LIMIT INIT ERROR - ${JSON.stringify(err)}`
        );

        javaScriptUtils.devLog(
          `Requests are limitied to ${this.settings.requestLimit} requests / ${this.settings.interval} seconds.`
        );

        return this.instance.updateSettings({
          reservoir: this.settings.requestLimit,
          reservoirRefreshAmount: this.settings.requestLimit,
          reservoirRefreshInterval: this.settings.interval * 1000,
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
          interval: xRateLimitAccountValues[1],
        };
      }

      throw new MissingXRateLimitAccountHeaderError();
    });
  };

  getInstance() {
    return this.instance;
  }

  getSettingsWithRemainingRequests() {
    return this.instance.currentReservoir().then(remainingRequests => ({
      ...this.settings,
      remainingRequests,
    }));
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
