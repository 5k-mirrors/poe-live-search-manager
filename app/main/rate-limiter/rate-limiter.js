import fetch from "node-fetch";
import * as poeTrade from "../poe-trade/poe-trade";
import * as baseUrls from "../../resources/BaseUrls/BaseUrls";

const headerKeys = {
  XRateLimitAccount: "x-rate-limit-account",
};

export default class RateLimiter {
  static initialize() {
    return fetch(`${baseUrls.poeFetchAPI}1`, {
      headers: {
        Cookie: poeTrade.getCookies(),
      },
    }).then(response => {
      if (response.headers.has(headerKeys.XRateLimitAccount)) {
        const splittedLimiterValues = response.headers
          .get(headerKeys.XRateLimitAccount)
          .split(":");

        // eslint-disable-next-line no-console
        console.table({
          limit: splittedLimiterValues[0],
          interval: splittedLimiterValues[1],
          timeout: splittedLimiterValues[2],
        });
      }
    });
  }
}
