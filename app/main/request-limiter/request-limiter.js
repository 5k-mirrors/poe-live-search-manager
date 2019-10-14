import { RateLimiter } from "limiter";
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
    this.defaulValues = {
      limit: 6,
      intervalInMs: 4000,
    };

    this.limiter = new RateLimiter(
      this.defaulValues.limit,
      this.defaulValues.intervalInMs
    );
  }

  initialize() {
    return this.dummyFetch()
      .then(details => {
        this.limiter = new RateLimiter(details.limit, details.intervalInMs);
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
        Cookie: poeTrade.getCookies(),
      },
    }).then(response => {
      if (response.headers.has(headerKeys.XRateLimitAccount)) {
        // return response.headers.get(headerKeys.XRateLimitAccount);
        const xRateLimitAccountValues = response.headers
          .get(headerKeys.XRateLimitAccount)
          .split(":");

        return {
          limit: xRateLimitAccountValues[0],
          intervalInMs: xRateLimitAccountValues[1] * 1000,
        };
      }

      throw new MissingXRateLimitAccountHeaderError();
    });
  };

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
