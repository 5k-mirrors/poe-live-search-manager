import fetch from "node-fetch";

import * as baseUrls from "../../shared/resources/BaseUrls/BaseUrls";
import { envIs } from "../../shared/utils/JavaScriptUtils/JavaScriptUtils";
import GlobalStore from "../../shared/GlobalStore/GlobalStore";
import { storeKeys } from "../../shared/resources/StoreKeys/StoreKeys";

const userAgent = () => {
  const dummyDevUserAgent = `only-used-for-development, ${process.env.EMAIL}`;
  return envIs("development")
    ? dummyDevUserAgent
    : `PoE Live Search Manager/${process.env.REVISION}, ${process.env.EMAIL}`;
};

const cookieHeader = () => {
  const globalStore = GlobalStore.getInstance();

  const poeSessionId = globalStore.get(storeKeys.POE_SESSION_ID);

  return `POESESSID=${poeSessionId}`;
};

const apiHeaders = () => {
  return {
    "Content-Type": "application/json",
    Cookie: cookieHeader(),
    "User-Agent": userAgent(),
  };
};

export const itemDetails = (ids, game) => {
  const itemUrl =
    game === "poe2"
      ? `${baseUrls.poe2FetchAPI}/${ids}`
      : `${baseUrls.poeFetchAPI}/${ids}`;

  return fetch(itemUrl, {
    headers: apiHeaders(),
  });
};

export const socketHeaders = () => {
  const socketOrigin = "https://www.pathofexile.com";

  return Object.assign(apiHeaders(), { Origin: socketOrigin });
};
