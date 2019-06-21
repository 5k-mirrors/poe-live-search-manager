import UrlParse from "url-parse";
import * as baseUrls from "../../resources/BaseUrls/BaseUrls";

const isLiveUrl = urlParts => urlParts.includes("live");

const lastElementIsSlash = urlParts => urlParts[urlParts.length - 1] === "";

const getLeague = url => url.split("search/")[1].split("/")[0];

const getId = url => {
  const urlParts = url.split("/");

  if (isLiveUrl(urlParts) && lastElementIsSlash(urlParts)) {
    return urlParts[urlParts.length - 3];
  }

  if (
    (isLiveUrl(urlParts) && !lastElementIsSlash(urlParts)) ||
    (!isLiveUrl(urlParts) && lastElementIsSlash(urlParts))
  ) {
    return urlParts[urlParts.length - 2];
  }

  return urlParts[urlParts.length - 1];
};

const parseUrl = url => {
  const league = getLeague(url);

  const id = getId(url);

  const parsedUrl = new UrlParse(`${baseUrls.poeWsUri}/${league}/${id}`);

  return parsedUrl.toString();
};

export default parseUrl;
