import GlobalStore from "../../../shared/GlobalStore/GlobalStore";
import { storeKeys } from "../../../resources/StoreKeys/StoreKeys";

export default () => {
  const globalStore = GlobalStore.getInstance();

  const poeSessionId = globalStore.get(storeKeys.POE_SESSION_ID);

  return `POESESSID=${poeSessionId}`;
};
