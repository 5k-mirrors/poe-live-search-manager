import fetch from "node-fetch";
import { globalStore } from "../../GlobalStore/GlobalStore";
import { storeKeys } from "../../resources/StoreKeys/StoreKeys";
import * as baseUrls from "../../resources/BaseUrls/BaseUrls";
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
  const whisperMessage = itemDetails[0].listing.whisper;

  return whisperMessage;
};

const getNotificationTitle = itemName => `New ${itemName} listed`;

export const notifyUser = (whisperMessage, itemName) =>
  doNotify({
    title: getNotificationTitle(itemName),
    body: whisperMessage
  });
