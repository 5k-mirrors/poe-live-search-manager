import * as baseUrls from "../../shared/resources/BaseUrls/BaseUrls";
import * as regExes from "../../shared/resources/RegExes/RegExes";

const getWebSocketUri = url => {
  const matchDetails = url.match(regExes.poeTradeUrl);

  const [, game, league, id] = matchDetails;

  if (game === "trade") {
    return `${baseUrls.poeWsUri}/${league}/${id}`;
  } else {
    return `${baseUrls.poe2WsUri}/${league}/${id}`;
  }
};

export default getWebSocketUri;
