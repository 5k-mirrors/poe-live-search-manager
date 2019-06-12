import fetch from "node-fetch";
import { globalStore } from "../../GlobalStore/GlobalStore";
import { storeKeys } from "../../resources/StoreKeys/StoreKeys";
import * as baseUrls from "../../resources/BaseUrls/BaseUrls";
import doNotify from "../utils/do-notify/do-notify";

export const getSession = () => {
  const poeSessionId = globalStore.get(storeKeys.POE_SESSION_ID, "");

  return `POESESSID=${poeSessionId}`;
};

export const getResult = id => {
  const itemUrl = `${baseUrls.tradeFetch + id}`;

  return fetch(itemUrl)
    .then(data => data.json())
    .then(parsedData => parsedData.result);
};

export const getWhisperMessage = result => {
  const whisperMessage = result[0].listing.whisper;

  return whisperMessage;
};

const getNotificationTitle = searchName => `New ${searchName} listed`;

const getNotificationBody = whisperMessage =>
  whisperMessage.buyout ? `~b/o ${whisperMessage.buyout}` : " ";

export const notifyUser = (whisperMessage, searchName) =>
  doNotify({
    title: getNotificationTitle(searchName),
    body: getNotificationBody(whisperMessage)
  });
