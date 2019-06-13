import fetch from "node-fetch";
import * as baseUrls from "../../resources/BaseUrls/BaseUrls";
import { globalStore } from "../../GlobalStore/GlobalStore";
import { storeKeys } from "../../resources/StoreKeys/StoreKeys";

export const getCookies = () => {
  const poeSessionId = globalStore.get(storeKeys.POE_SESSION_ID, "");

  return `POESESSID=${poeSessionId}`;
};

export const fetchItemDetails = id => {
  const itemUrl = `${baseUrls.poeFetchAPI + id}`;

  return fetch(itemUrl).then(data => data.json());
};
