import { itemDetails } from "../api/api";
import {
  safeGet,
  safeJsonResponse,
  isDefined,
  devErrorLog,
} from "../../shared/utils/JavaScriptUtils/JavaScriptUtils";
import * as electronUtils from "../utils/electron-utils/electron-utils";
import HttpRequestLimiter from "../http-request-limiter/http-request-limiter";
import { ipcEvents } from "../../shared/resources/IPCEvents/IPCEvents";
import { windows } from "../../shared/resources/Windows/Windows";

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

export const fetchItemDetails = ids =>
  HttpRequestLimiter.schedule(() => {
    return itemDetails(ids)
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

          const itemDetailsResponse = safeGet(parsedData, ["result"]);

          if (isDefined(itemDetailsResponse)) {
            return itemDetailsResponse;
          }

          throw new Error(`Item details not found for ${ids}`);
        })
      )
      .catch(error => {
        devErrorLog(error);
        throw error;
      });
  });

export const getWhisperMessage = itemDetailsResponse => {
  const whisperMessage = safeGet(itemDetailsResponse, ["listing", "whisper"]);

  if (!isDefined(whisperMessage)) {
    return "";
  }

  return whisperMessage;
};

export const getPrice = itemDetailsResponse => {
  const amount = safeGet(itemDetailsResponse, ["listing", "price", "amount"]);
  const currency = safeGet(itemDetailsResponse, [
    "listing",
    "price",
    "currency",
  ]);

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
