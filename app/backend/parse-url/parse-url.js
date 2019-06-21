import UrlParse from "url-parse";
import * as baseUrls from "../../resources/BaseUrls/BaseUrls";

const isLiveUrl = urlParts => urlParts.includes("live");

const lastElementIsSlash = urlParts => urlParts[urlParts.length - 1] === "";

const getLeague = url => url.split("search/")[1].split("/")[0];

const getId = url => {
  const urlParts = url.split("/");

  let id = urlParts[urlParts.length - 1];

  if (isLiveUrl(urlParts)) {
    id = urlParts[urlParts.length - 2];

    if (lastElementIsSlash(urlParts)) {
      id = urlParts[urlParts.length - 3];
    }

    return id;
  }

  if (lastElementIsSlash(urlParts)) {
    id = urlParts[urlParts.length - 2];
  }

  return id;
};

const parseUrl = url => {
  const league = getLeague(url);

  const id = getId(url);

  const parsedUrl = new UrlParse(`${baseUrls.poeWsUri}/${league}/${id}`);

  return parsedUrl.toString();
};

export default parseUrl;
