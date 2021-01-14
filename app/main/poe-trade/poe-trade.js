import fetch from "node-fetch";
import * as baseUrls from "../../shared/resources/BaseUrls/BaseUrls";
import {
  safeGet,
  safeJsonResponse,
  isDefined,
  devErrorLog,
} from "../../shared/utils/JavaScriptUtils/JavaScriptUtils";
import * as electronUtils from "../utils/electron-utils/electron-utils";
import ItemFetchError from "../../shared/errors/item-fetch-error";
import HttpRequestLimiter from "../http-request-limiter/http-request-limiter";
import { ipcEvents } from "../../shared/resources/IPCEvents/IPCEvents";
import { windows } from "../../shared/resources/Windows/Windows";
import packageJson from "../../../package.json";

const startReservoirIncreaseListener = () => {
  const intervalId = setInterval(() => {
    return HttpRequestLimiter.currentReservoir().then(currentReservoir => {
      if (currentReservoir > 0 && HttpRequestLimiter.requestsExhausted) {
        HttpRequestLimiter.requestsExhausted = false;

        electronUtils.send(
          windows.MAIN,
          ipcEvents.RATE_LIMIT_STATUS_CHANGE,
          HttpRequestLimiter.requestsExhausted
        );

        clearInterval(intervalId);
      }
    });
  }, 1000);
};

export const fetchItemDetails = id =>
  HttpRequestLimiter.schedule(() => {
    const itemUrl = `${baseUrls.poeFetchAPI + id}`;

    return fetch(itemUrl, {
      headers: {
        "Content-Type": "application/json",
        "User-Agent": `PoE Live Search Manager/${packageJson.version}`,
      },
    })
      .then(data => safeJsonResponse(data))
      .then(parsedData =>
        HttpRequestLimiter.currentReservoir().then(currentReservoir => {
          if (currentReservoir === 0 && !HttpRequestLimiter.requestsExhausted) {
            HttpRequestLimiter.requestsExhausted = true;

            electronUtils.send(
              windows.MAIN,
              ipcEvents.RATE_LIMIT_STATUS_CHANGE,
              HttpRequestLimiter.requestsExhausted
            );

            startReservoirIncreaseListener();
          }

          const itemDetails = safeGet(parsedData, ["result", 0]);

          if (isDefined(itemDetails)) {
            return itemDetails;
          }

          throw new ItemFetchError(`Item details not found for ${itemUrl}`);
        })
      )
      .catch(error => {
        devErrorLog(error);
        throw error;
      });
  });

export const getWhisperMessage = itemDetails => {
  const whisperMessage = safeGet(itemDetails, ["listing", "whisper"]);

  if (!isDefined(whisperMessage)) {
    return "";
  }

  return whisperMessage;
};

export const getPrice = itemDetails => {
  const amount = safeGet(itemDetails, ["listing", "price", "amount"]);
  const currency = safeGet(itemDetails, ["listing", "price", "currency"]);

  if (amount === null || currency === null) return "";

  return `${amount} ${currency}`;
};

export const notifyUser = (itemName, price) => {
  const title = `New ${itemName} listed`;

  electronUtils.doNotify({
    title,
    body: price,
  });
};
