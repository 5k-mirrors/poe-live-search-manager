import fetch from "node-fetch";

import { userAgent } from "../../shared/resources/userAgent";
import * as baseUrls from "../../shared/resources/BaseUrls/BaseUrls";
import getCookieHeader from "../utils/get-cookie-header/get-cookie-header";

export const itemDetails = ids => {
  const itemUrl = `${baseUrls.poeFetchAPI}/${ids}`;

  return fetch(itemUrl, {
    headers: {
      "Content-Type": "application/json",
      Cookie: getCookieHeader(),
      "User-Agent": userAgent(),
    },
  });
};
