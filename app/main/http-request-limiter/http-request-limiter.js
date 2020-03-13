import Bottleneck from "bottleneck";
import fetch from "node-fetch";
import getCookieHeader from "../utils/get-cookie-header/get-cookie-header";
import MissingXRateLimitAccountHeaderError from "../../errors/missing-x-rate-limit-account-header-error";
import * as baseUrls from "../../resources/BaseUrls/BaseUrls";
import {
  devLog,
  devErrorLog,
} from "../../utils/JavaScriptUtils/JavaScriptUtils";
import headerKeys from "../../resources/HeaderKeys/HeaderKeys";

export default class HttpRequestLimiter {
  static defaultValues = {
    requestLimit: 6,
    interval: 4,
  };

  static bottleneck = new Bottleneck();

  static requestsExhausted = false;

  static initialize() {
    return this.initialFetch()
      .then(({ requestLimit, interval }) => {
        devLog(
          `Requests are limited to ${requestLimit} requests / ${interval} seconds.`
        );

        return this.bottleneck.updateSettings({
          reservoir: requestLimit,
          reservoirRefreshAmount: requestLimit,
          reservoirRefreshInterval: interval * 1000,
        });
      })
      .catch(err => {
        devErrorLog("Rate limit init error: ", err);

        devLog(
          `Requests are limitied to ${this.defaultValues.requestLimit} requests / ${this.defaultValues.interval} seconds.`
        );

        this.bottleneck.updateSettings({
          reservoir: this.defaultValues.requestLimit,
          reservoirRefreshAmount: this.defaultValues.requestLimit,
          reservoirRefreshInterval: this.defaultValues.interval * 1000,
        });
      });
  }

  static initialFetch() {
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
          requestLimit: Number(xRateLimitAccountValues[0]),
          interval: Number(xRateLimitAccountValues[1]),
        };
      }

      throw new MissingXRateLimitAccountHeaderError();
    });
  }

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
