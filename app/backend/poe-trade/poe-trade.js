import fetch from "node-fetch";
import { globalStore } from "../../GlobalStore/GlobalStore";
import { storeKeys } from "../../resources/StoreKeys/StoreKeys";
import * as baseUrls from "../../resources/BaseUrls/BaseUrls";
import * as javaScriptUtils from "../../utils/JavaScriptUtils/JavaScriptUtils";
import doNotify from "../utils/do-notify/do-notify";

export const getCookies = () => {
  const poeSessionId = globalStore.get(storeKeys.POE_SESSION_ID, "");

  return `POESESSID=${poeSessionId}`;
};

export const fetchItemDetails = id => {
  const itemUrl = `${baseUrls.poeFetchAPI + id}`;

  return fetch(itemUrl)
    .then(itemDetails => itemDetails.json())
    .then(parsedItemDetails => parsedItemDetails.result);
};

export const getWhisperMessage = itemDetails => {
  const whisperMessage = javaScriptUtils.safeGet(itemDetails, [
    0,
    "listing",
    "whisper"
  ]);

  if (whisperMessage !== null) {
    return whisperMessage;
  }

  return "";
};

const getNotificationTitle = itemName => `New ${itemName} listed`;

const getNotificationBody = whisperMessage =>
  whisperMessage.buyout ? `~b/o ${whisperMessage.buyout}` : "";

export const notifyUser = (whisperMessage, itemName) =>
  doNotify({
    title: getNotificationTitle(itemName),
    body: getNotificationBody(whisperMessage)
  });
