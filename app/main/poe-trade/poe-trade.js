import fetch from "node-fetch";
import * as baseUrls from "../../resources/BaseUrls/BaseUrls";
import * as javaScriptUtils from "../../utils/JavaScriptUtils/JavaScriptUtils";
import * as electronUtils from "../utils/electron-utils/electron-utils";
import ItemFetchError from "../../errors/item-fetch-error";
import requestLimiter from "../request-limiter/request-limiter";

export const fetchItemDetails = async id => {
  const limiter = requestLimiter.get();
  const itemUrl = `${baseUrls.poeFetchAPI + id}`;

  return limiter
    .schedule(() => fetch(itemUrl))
    .then(data => data.json())
    .then(parsedData => {
      const itemDetails = javaScriptUtils.safeGet(parsedData, ["result", 0]);

      if (javaScriptUtils.isDefined(itemDetails)) {
        return itemDetails;
      }

      throw new ItemFetchError(`Item details not found for ${itemUrl}`);
    });
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
