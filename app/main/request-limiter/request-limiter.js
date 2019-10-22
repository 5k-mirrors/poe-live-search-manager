import Bottleneck from "bottleneck";
import fetch from "node-fetch";
import getCookieHeader from "../utils/get-cookie-header/get-cookie-header";
import MissingXRateLimitAccountHeaderError from "../../errors/missing-x-rate-limit-account-header-error";
import * as baseUrls from "../../resources/BaseUrls/BaseUrls";

const headerKeys = {
  XRateLimitAccount: "x-rate-limit-account",
};

class RequestLimiter {
  constructor() {
    this.defaulValues = {
      limit: 16,
      interval: 4000,
    };

    this.instance = new Bottleneck({
      reservoir: this.defaulValues.limit,
      reservoirRefreshAmount: this.defaulValues.limit,
      reservoirRefreshInterval: this.defaulValues.interval,
      maxConcurrent: 1,
      minTime: 333,
    });
  }

  initialize() {
    return this.dummyFetch()
      .then(limitDetails => {
        return this.instance.updateSettings({
          reservoir: limitDetails.requestLimit,
          reservoirRefreshAmount: limitDetails.requestLimit,
          reservoirRefreshInterval: limitDetails.interval,
        });
      })
      .catch(err => {
        if (err instanceof MissingXRateLimitAccountHeaderError) {
          // eslint-disable-next-line no-console
          console.warn(err);
        }
      });
  }

  dummyFetch = () => {
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
