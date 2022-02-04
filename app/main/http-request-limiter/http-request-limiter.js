import Bottleneck from "bottleneck";
import fetch from "node-fetch";
import getCookieHeader from "../utils/get-cookie-header/get-cookie-header";
import * as baseUrls from "../../shared/resources/BaseUrls/BaseUrls";
import {
  devLog,
  devErrorLog,
} from "../../shared/utils/JavaScriptUtils/JavaScriptUtils";
import headerKeys from "../../shared/resources/HeaderKeys/HeaderKeys";
import { userAgent } from "../../shared/resources/userAgent";

export default class HttpRequestLimiter {
  static config = {
    defaultReservoirValues: {
      requestLimit: 6,
      interval: 4,
    },
    minRequestIntervalMs: 1500,
  };

  static bottleneck = new Bottleneck();

  static requestsExhausted = false;

  static initialize() {
    return this.initialFetch()
      .then(response => {
        return this.rateLimitFromHeaders(response);
      })
      .then(({ requestLimit, interval }) => {
        devLog(
          `Requests are limited to ${requestLimit} requests / ${interval} seconds.`
        );

        return this.bottleneck.updateSettings({
          reservoir: requestLimit,
          reservoirRefreshAmount: requestLimit,
          reservoirRefreshInterval: interval * 1000,
          // GGG prohibits bursting requests (even though this is not specified by the rate-limiting headers).
          minTime: Math.max(
            this.config.minRequestIntervalMs,
            interval / requestLimit
          ),
          maxConcurrent: 1,
        });
      });
  }

  static rateLimitFromHeaders = response => {
    if (response.status > 299) {
      devErrorLog(
        `Error response while fetching rate limit headers: ${response.status}`
      );
    }

    if (response.headers.has(headerKeys.XRateLimitAccount)) {
      const xRateLimitAccountValues = response.headers
        .get(headerKeys.XRateLimitAccount)
        .split(":");

      return {
        requestLimit: Number(xRateLimitAccountValues[0]),
        interval: Number(xRateLimitAccountValues[1]),
      };
    }

    devLog(`Account rate limits not found, using defaults.`);
    return this.config.defaultReservoirValues;
  };

  static initialFetch = () => {
    const dummyId = "1";
    return fetch(`${baseUrls.poeFetchAPI}/${dummyId}`, {
      headers: {
        Cookie: getCookieHeader(),
        "Content-Type": "application/json",
        "User-Agent": userAgent(),
      },
    });
  };

  static incrementReservoir(incrementBy) {
    return this.bottleneck.incrementReservoir(incrementBy);
  }

  static currentReservoir() {
    return this.bottleneck.currentReservoir();
  }

  static schedule(cb) {
    return this.bottleneck.schedule(() => cb());
  }
}
