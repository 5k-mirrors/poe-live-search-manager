import * as baseUrls from "../../shared/resources/BaseUrls/BaseUrls";
import * as regExes from "../../shared/resources/RegExes/RegExes";

const getWebSocketUri = url => {
  const matchDetails = url.match(regExes.poeTradeUrl);

  const [, league, id] = matchDetails;

  return `${baseUrls.poeWsUri}/${league}/${id}`;
};

export default getWebSocketUri;
