import fetch from "node-fetch";
import { Mutex } from "async-mutex";
import * as baseUrls from "../../resources/BaseUrls/BaseUrls";
import * as javaScriptUtils from "../../utils/JavaScriptUtils/JavaScriptUtils";
import * as electronUtils from "../utils/electron-utils/electron-utils";
import ItemFetchError from "../../errors/item-fetch-error";
import HttpRequestLimiter from "../http-request-limiter/http-request-limiter";
import { currencyNames } from "../../resources/CurrencyNames/CurrencyNames";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";
import { windows } from "../../resources/Windows/Windows";

class ConcurrentLimiterScheduleMutex {
  static mutex = new Mutex();

  static acquire() {
    return this.mutex.acquire();
  }

  static isLocked() {
    return this.mutex.isLocked();
  }
}

const startReservoirIncreaseListener = () => {
  console.log("Interval is set ...");
  const intervalId = setInterval(() => {
    return HttpRequestLimiter.currentReservoir().then(currentReservoir => {
      if (
        currentReservoir > 0 &&
        HttpRequestLimiter.requestsExhausted &&
        !ConcurrentLimiterScheduleMutex.isLocked()
      ) {
        HttpRequestLimiter.requestsExhausted = false;

        electronUtils.send(
          windows.MAIN,
          ipcEvents.RATE_LIMIT_STATUS_CHANGE,
          HttpRequestLimiter.requestsExhausted
        );

        console.log("Cleaned up interval ...");

        clearInterval(intervalId);
      }
    });
  }, 1000);
};

/* const ensureReservoir = () => {
  if (!HttpRequestLimiter.requestsExhausted) {
    return HttpRequestLimiter.currentReservoir().then(remainingRequests => {
      if (remainingRequests === 0) {
        HttpRequestLimiter.requestsExhausted = true;

        electronUtils.send(
          windows.MAIN,
          ipcEvents.RATE_LIMIT_STATUS_CHANGE,
          HttpRequestLimiter.requestsExhausted
        );

        startReservoirIncreaseListener();
      }
    });
  }
}; */

const ensureRequests = () => {
  if (!HttpRequestLimiter.requestsExhausted) {
    return HttpRequestLimiter.currentReservoir().then(remainingRequests => {
      if (remainingRequests === 0) {
        HttpRequestLimiter.requestsExhausted = true;

        // Send the changes in status to renderer ...
        electronUtils.send(
          windows.MAIN,
          ipcEvents.RATE_LIMIT_STATUS_CHANGE,
          HttpRequestLimiter.requestsExhausted
        );

        // Start the "observer" ...
        startReservoirIncreaseListener();
      }
    });
  }

  return Promise.resolve();
};

export const fetchItemDetails = id => {
  // Lock is required, otherwise, if `schedue()` is invocated parallelly it doesn't decrement the value.
  // https://github.com/c-hive/poe-sniper/pull/205#issuecomment-555496803
  return ConcurrentLimiterScheduleMutex.acquire().then(release =>
    HttpRequestLimiter.schedule(() => {
      // The lock is released as early as possible so that it doesn't occupy the app for far too long.
      // https://github.com/c-hive/poe-sniper/pull/205#issuecomment-556532356
      release();

      const itemUrl = `${baseUrls.poeFetchAPI + id}`;

      return fetch(itemUrl)
        .then(data => data.json())
        .then(parsedData =>
          ensureRequests().then(() => {
            const itemDetails = javaScriptUtils.safeGet(parsedData, [
              "result",
              0,
            ]);

            if (javaScriptUtils.isDefined(itemDetails)) {
              return itemDetails;
            }

            throw new ItemFetchError(`Item details not found for ${itemUrl}`);
          })
        );
    })
  );
};

/* export const fetchItemDetails = id =>
  HttpRequestLimiter.schedule(() => {
    const itemUrl = `${baseUrls.poeFetchAPI + id}`;

    return fetch(itemUrl)
      .then(data => data.json())
      .then(parsedData =>
        HttpRequestLimiter.currentReservoir().then(currentReservoir => {
          console.log(currentReservoir);
          if (currentReservoir === 0 && !HttpRequestLimiter.requestsExhausted) {
            HttpRequestLimiter.requestsExhausted = true;

            electronUtils.send(
              windows.MAIN,
              ipcEvents.RATE_LIMIT_STATUS_CHANGE,
              HttpRequestLimiter.requestsExhausted
            );

            startReservoirIncreaseListener();
          }

          const itemDetails = javaScriptUtils.safeGet(parsedData, [
            "result",
            0,
          ]);

          if (javaScriptUtils.isDefined(itemDetails)) {
            return itemDetails;
          }

          throw new ItemFetchError(`Item details not found for ${itemUrl}`);
        })
      );
  }); */

export const getWhisperMessage = itemDetails => {
  const whisperMessage = javaScriptUtils.safeGet(itemDetails, [
    "listing",
    "whisper",
  ]);

  if (!javaScriptUtils.isDefined(whisperMessage)) {
    return "";
  }

  return whisperMessage;
};

export const getPrice = whisperMessage => {
  const currencies = currencyNames.join("|");
  const pattern = `\\d+\\.?\\d* (${currencies})+`;
  const regexp = new RegExp(pattern);
  const matchDetails = whisperMessage.match(regexp);

  // => `match` returns `null` if there's no corresponding item in the string.
  if (!javaScriptUtils.isDefined(matchDetails)) {
    return "";
  }

  return `~b/o ${matchDetails[0]}`;
};

export const notifyUser = (itemName, price) => {
  const title = `New ${itemName} listed`;

  electronUtils.doNotify({
    title,
    body: price,
  });
};
