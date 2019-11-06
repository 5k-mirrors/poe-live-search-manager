import Bottleneck from "bottleneck";
import { ipcMain } from "electron";
import fetch from "node-fetch";
import getCookieHeader from "../utils/get-cookie-header/get-cookie-header";
import MissingXRateLimitAccountHeaderError from "../../errors/missing-x-rate-limit-account-header-error";
import * as baseUrls from "../../resources/BaseUrls/BaseUrls";
import * as javaScriptUtils from "../../utils/JavaScriptUtils/JavaScriptUtils";
import headerKeys from "../../resources/HeaderKeys/HeaderKeys";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";

class RequestLimiter {
  constructor() {
    this.defaultValues = {
      requestLimit: 16,
      interval: 4000,
    };

    this.instance = new Bottleneck({
      maxConcurrent: 1,
      minTime: 333,
    });
  }

  initialize() {
    ipcMain.send(
      ipcEvents.REMAINING_REQUESTS_UPDATE,
      this.defaultValues.requestLimit
    );

    return this.initialFetch()
      .then(({ requestLimit, interval }) => {
        javaScriptUtils.devLog(
          `Requests are limited to ${requestLimit} requests / ${interval} ms.`
        );

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

        javaScriptUtils.devLog(
          `Requests are limitied to ${this.defaultValues.requestLimit} requests / ${this.defaultValues.interval} ms.`
        );

        return this.instance.updateSettings({
          reservoir: this.defaultValues.requestLimit,
          reservoirRefreshAmount: this.defaultValues.requestLimit,
          reservoirRefreshInterval: this.defaultValues.interval,
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
