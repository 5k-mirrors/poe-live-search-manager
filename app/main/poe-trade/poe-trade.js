import fetch from "node-fetch";
import { globalStore } from "../../GlobalStore/GlobalStore";
import { storeKeys } from "../../resources/StoreKeys/StoreKeys";
import * as baseUrls from "../../resources/BaseUrls/BaseUrls";
import * as javaScriptUtils from "../../utils/JavaScriptUtils/JavaScriptUtils";
import * as electronUtils from "../utils/electron-utils/electron-utils";
import ItemFetchError from "../../errors/item-fetch-error";

export const getCookies = () => {
  const poeSessionId = globalStore.get(storeKeys.POE_SESSION_ID);

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
    "whisper",
  ]);

  if (!javaScriptUtils.isDefined(whisperMessage)) {
    return "";
  }

  return whisperMessage;
};

export const getPrice = whisperMessage => {
  const pattern = /\d+\.?\d* (chaos|fusing|alch|gcp|chrom|jew|chance|chisel|scour|blessed|regret|regal|divine|vaal|exa|alt)+/;
  const matchDetails = whisperMessage.match(pattern);

  // => `match` returns `null` if there's no corresponding item in the string.
  if (!javaScriptUtils.isDefined(matchDetails)) {
    return "";
  }

  return `~b/o ${matchDetails[0]}`;
};

export const notifyUser = (itemName, price) => {
  const title = `New ${itemName} listed`;

  electronUtils.doNotify({
    title,
    body: price,
  });
};
