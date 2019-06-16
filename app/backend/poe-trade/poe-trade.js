import fetch from "node-fetch";
import { globalStore } from "../../GlobalStore/GlobalStore";
import { storeKeys } from "../../resources/StoreKeys/StoreKeys";
import * as baseUrls from "../../resources/BaseUrls/BaseUrls";
import * as javaScriptUtils from "../../utils/JavaScriptUtils/JavaScriptUtils";
import doNotify from "../utils/do-notify/do-notify";
import ItemFetchError from "../errors/item-fetch-error";

export const getCookies = () => {
  const poeSessionId = globalStore.get(storeKeys.POE_SESSION_ID, "");

  return `POESESSID=${poeSessionId}`;
};

export const fetchItemDetails = id => {
  const itemUrl = `${baseUrls.poeFetchAPI + id}`;

  return fetch(itemUrl)
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
    "whisper"
  ]);

  if (javaScriptUtils.isDefined(whisperMessage)) {
    return whisperMessage;
  }

  return "";
};

const getNotificationTitle = itemName => `New ${itemName} listed`;

export const notifyUser = (whisperMessage, itemName) =>
  doNotify({
    title: getNotificationTitle(itemName),
    body: whisperMessage
  });

