import fetch from "node-fetch";
import { clipboard } from "electron";
import * as baseUrls from "../../resources/BaseUrls/BaseUrls";
import { globalStore } from "../../GlobalStore/GlobalStore";
import { storeKeys } from "../../resources/StoreKeys/StoreKeys";

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

const getWhisperMessage = result => {
  const whisperMessage = result[0].listing.whisper;

  return whisperMessage;
};

export const copyWhisperToClipboard = result => {
  const whisperMessage = getWhisperMessage(result);

  clipboard.writeText(whisperMessage);
};
