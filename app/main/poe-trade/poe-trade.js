import fetch from "node-fetch";
import { globalStore } from "../../GlobalStore/GlobalStore";
import { storeKeys } from "../../resources/StoreKeys/StoreKeys";
import * as baseUrls from "../../resources/BaseUrls/BaseUrls";
import * as javaScriptUtils from "../../utils/JavaScriptUtils/JavaScriptUtils";
import * as electronUtils from "../utils/electron-utils/electron-utils";
import ItemFetchError from "../../errors/item-fetch-error";

// eslint-disable-next-line import/no-cycle
import requestLimiter from "../request-limiter/request-limiter";

export const getCookies = () => {
  const poeSessionId = globalStore.get(storeKeys.POE_SESSION_ID);

  return `POESESSID=${poeSessionId}`;
};

export const fetchItemDetails = id => {
  const limiter = requestLimiter.get();

  const itemUrl = `${baseUrls.poeFetchAPI + id}`;

  return new Promise((resolve, reject) => {
    return limiter.removeTokens(1, (err, remainingRequests) => {
      console.log("[err]", err);
      console.log("[remainingRequests]", remainingRequests);

      if (err) return reject(err);

      return fetch(itemUrl)
        .then(response => response.json())
        .then(parsedResponse => {
          const itemDetails = javaScriptUtils.safeGet(parsedResponse, [
            "result",
            0,
          ]);

          if (javaScriptUtils.isDefined(itemDetails)) {
            // return itemDetails;
            return resolve(itemDetails);
          }

          // throw new ItemFetchError(`Item details not found for ${itemUrl}`);
          return reject(
            new ItemFetchError(`Item details not found for ${itemUrl}`)
          );
        });
    });
  });

  /* return limiter.removeTokens(1, (err, remainingRequests) => {
    console.log("[err]", err);
    console.log("[remainingRequests]", remainingRequests);

    return fetch(itemUrl)
      .then(response => response.json())
      .then(parsedResponse => {
        const itemDetails = javaScriptUtils.safeGet(parsedResponse, [
          "result",
          0,
        ]);

        if (javaScriptUtils.isDefined(itemDetails)) {
          return itemDetails;
        }

        throw new ItemFetchError(`Item details not found for ${itemUrl}`);
      });
  }); */
};

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
  const matchDetails = whisperMessage.match(/listed for [\d]+ [\S]+/);

  // => `match` returns `null` if there's no corresponding item in the string.
  if (!javaScriptUtils.isDefined(matchDetails)) {
    return "";
  }

  const itemPrice = matchDetails[0]
    .split(" ")
    .splice(2, 3)
    .join(" ");

  return `~b/o ${itemPrice}`;
};

export const notifyUser = (itemName, price) => {
  const title = `New ${itemName} listed`;

  electronUtils.doNotify({
    title,
    body: price,
  });
};
