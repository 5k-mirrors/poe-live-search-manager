import * as baseUrls from "../../resources/BaseUrls/BaseUrls";

const isLiveUrl = splittedPathname => splittedPathname.includes("live");

const lastElementIsSlash = splittedPathname =>
  splittedPathname[splittedPathname.length - 1] === "";

const getLeague = pathname => pathname.split("search/")[1].split("/")[0];

const handleLiveUrl = splittedPathname => {
  if (lastElementIsSlash(splittedPathname)) {
    return splittedPathname[splittedPathname.length - 3];
  }

  return splittedPathname[splittedPathname.length - 2];
};

const getId = pathname => {
  const splittedPathname = pathname.split("/");

  let id = splittedPathname[splittedPathname.length - 1];

  if (isLiveUrl(splittedPathname)) {
    id = handleLiveUrl(splittedPathname);
  }

  if (!isLiveUrl(splittedPathname) && lastElementIsSlash(splittedPathname)) {
    id = splittedPathname[splittedPathname.length - 2];
  }

  return id;
};

const getWebSocketUri = url => {
  const parsedUrl = new URL(url);

  const league = getLeague(parsedUrl.pathname);

  const id = getId(parsedUrl.pathname);

  return `${baseUrls.poeWsUri}/${league}/${id}`;
};

export default getWebSocketUri;
