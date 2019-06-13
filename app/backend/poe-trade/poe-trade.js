import fetch from "node-fetch";
import * as baseUrls from "../../resources/BaseUrls/BaseUrls";
import * as javaScriptUtils from "../../utils/JavaScriptUtils/JavaScriptUtils";
import { globalStore } from "../../GlobalStore/GlobalStore";
import { storeKeys } from "../../resources/StoreKeys/StoreKeys";
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
      if (javaScriptUtils.isDefined(parsedData.result[0])) {
        return parsedData.result[0];
      }

      throw new ItemFetchError(`Item details not found for ${itemUrl}`);
    });
};

export const getWhisperMessage = itemDetails => {
  const whisperMessage = itemDetails.listing.whisper;

  return whisperMessage;
};

const getNotificationTitle = itemName => `New ${itemName} listed`;

export const notifyUser = (whisperMessage, itemName) =>
  doNotify({
    title: getNotificationTitle(itemName),
    body: whisperMessage
  });
