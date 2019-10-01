import Bottleneck from "bottleneck";
import fetch from "node-fetch";
import * as poeTrade from "../poe-trade/poe-trade";
import * as baseUrls from "../../resources/BaseUrls/BaseUrls";

const headerKeys = {
  XRateLimitAccount: "x-rate-limit-account",
};

class MissingXRateLimitAccountHeaderError extends Error {
  constructor(...args) {
    super(...args);

    Error.captureStackTrace(this, MissingXRateLimitAccountHeaderError);

    this.name = this.constructor.name;
  }
}

class RequestLimiter {
  constructor() {
    this.limiter = new Bottleneck();
  }

  initialize() {
    return this.dummyFetch().then(details => {
      this.limiter
        .updateSettings({
          maxConcurrent: details.limit,
          minTime: details.interval,
          penalty: details.timeout,
        })
        .catch(err => {
          if (err instanceof MissingXRateLimitAccountHeaderError) {
            // eslint-disable-next-line no-console
            console.warn(err);
          }
        });
    });
  }

  // eslint-disable-next-line class-methods-use-this
  dummyFetch() {
    return fetch(`${baseUrls.poeFetchAPI}1`, {
      headers: {
        Cookie: poeTrade.getCookies(),
      },
    }).then(response => {
      if (response.headers.has(headerKeys.XRateLimitAccount)) {
        const splittedLimiterValues = response.headers
          .get(headerKeys.XRateLimitAccount)
          .split(":");

        return {
          limit: splittedLimiterValues[0],
          interval: splittedLimiterValues[1],
          timeout: splittedLimiterValues[2],
        };
      }

      throw new MissingXRateLimitAccountHeaderError();
    });
  }

  get() {
    return this.limiter;
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
