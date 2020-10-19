import fetch from "node-fetch";
import * as baseUrls from "../../resources/BaseUrls/BaseUrls";
import {
  safeGet,
  safeJsonResponse,
  isDefined,
} from "../../utils/JavaScriptUtils/JavaScriptUtils";
import * as electronUtils from "../utils/electron-utils/electron-utils";
import ItemFetchError from "../../errors/item-fetch-error";
import HttpRequestLimiter from "../http-request-limiter/http-request-limiter";
import { currencyNames } from "../../resources/CurrencyNames/CurrencyNames";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";
import { windows } from "../../resources/Windows/Windows";

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

    return fetch(itemUrl)
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
      );
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
  return `${amount} ${currency}`;
};

export const getPriceFromWhisper = whisperMessage => {
  const currencies = currencyNames.join("|");
  const pattern = ` \\d+\\.?\\d* (${currencies}){1} `;
  const regexp = new RegExp(pattern);
  const matchDetails = whisperMessage.match(regexp);

  // => `match` returns `null` if there's no corresponding item in the string.
  if (!isDefined(matchDetails)) {
    return "";
  }

  return `~b/o ${matchDetails[0].trim()}`;
};

export const notifyUser = (itemName, price) => {
  const title = `New ${itemName} listed`;

  electronUtils.doNotify({
    title,
    body: price,
  });
};
