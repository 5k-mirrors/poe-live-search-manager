import fetch from "node-fetch";

import * as baseUrls from "../../shared/resources/BaseUrls/BaseUrls";
import packageJson from "../../../package.json";
import { envIs } from "../../shared/utils/JavaScriptUtils/JavaScriptUtils";
import GlobalStore from "../../shared/GlobalStore/GlobalStore";
import { storeKeys } from "../../shared/resources/StoreKeys/StoreKeys";

const userAgent = () => {
  const dummyDevUserAgent =
    "only-used-for-development, git.thisismydesign@gmail.com";
  return envIs("development")
    ? dummyDevUserAgent
    : `PoE Live Search Manager/${packageJson.version}`;
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

export const itemDetails = ids => {
  const itemUrl = `${baseUrls.poeFetchAPI}/${ids}`;

  return fetch(itemUrl, {
    headers: apiHeaders(),
  });
};

export const socketHeaders = () => {
  const socketOrigin = "https://www.pathofexile.com";

  return apiHeaders.merge({ Origin: socketOrigin });
};
