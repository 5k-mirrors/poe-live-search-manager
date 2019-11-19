import Bottleneck from "bottleneck";
import fetch from "node-fetch";
import getCookieHeader from "../utils/get-cookie-header/get-cookie-header";
import MissingXRateLimitAccountHeaderError from "../../errors/missing-x-rate-limit-account-header-error";
import * as baseUrls from "../../resources/BaseUrls/BaseUrls";
import * as javaScriptUtils from "../../utils/JavaScriptUtils/JavaScriptUtils";
import headerKeys from "../../resources/HeaderKeys/HeaderKeys";

class RequestLimiter {
  constructor() {
    this.defaultValues = {
      requestLimit: 6,
      interval: 4,
    };

    this.instance = new Bottleneck();
  }

  initialize() {
    return this.initialFetch()
      .then(({ requestLimit, interval }) => {
        javaScriptUtils.devLog(
          `Requests are limited to ${requestLimit} requests / ${interval} seconds.`
        );

        console.log(interval * 1000);

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
          `Requests are limitied to ${this.defaultValues.requestLimit} requests / ${this.defaultValues.interval} seconds.`
        );

        this.instance.updateSettings({
          reservoir: this.defaultValues.requestLimit,
          reservoirRefreshAmount: this.defaultValues.requestLimit,
          reservoirRefreshInterval: this.defaultValues.interval * 1000,
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

        console.log(xRateLimitAccountValues);

        return {
          requestLimit: Number(xRateLimitAccountValues[0]),
          interval: Number(xRateLimitAccountValues[1]),
        };
      }

      throw new MissingXRateLimitAccountHeaderError();
    });
  };

  getInstance() {
    return this.instance;
  }

  isActive() {
    return this.instance.currentReservoir().then(currentReservoir => {
      console.log("[currentReservoir]", currentReservoir);

      return currentReservoir === 0;
    });
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
