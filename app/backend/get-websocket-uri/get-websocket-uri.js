import * as baseUrls from "../../resources/BaseUrls/BaseUrls";
import * as regExes from "../../resources/RegExes/RegExes";

const getWebSocketUri = url => {
  const matchDetails = url.match(regExes.searchUrlLeagueAndIdMatcher);

  const [, league, id] = matchDetails;

  return `${baseUrls.poeWsUri}/${league}/${id}`;
};

export default getWebSocketUri;
