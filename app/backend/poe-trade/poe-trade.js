import fetch from "node-fetch";
import { clipboard } from "electron";
import * as baseUrls from "../../resources/BaseUrls/BaseUrls";
import * as javaScriptUtils from "../../utils/JavaScriptUtils/JavaScriptUtils";
import { globalStore } from "../../GlobalStore/GlobalStore";
import { storeKeys } from "../../resources/StoreKeys/StoreKeys";
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

const getWhisperMessage = itemDetails => {
  const whisperMessage = itemDetails.listing.whisper;

  return whisperMessage;
};

export const copyWhisperToClipboard = itemDetails => {
  const whisperMessage = getWhisperMessage(itemDetails);

  clipboard.writeText(whisperMessage);
};
