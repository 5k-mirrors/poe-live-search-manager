import { globalStore } from "../../../GlobalStore/GlobalStore";
import { storeKeys } from "../../../resources/StoreKeys/StoreKeys";

export default () => {
  const poeSessionId = globalStore.get(storeKeys.POE_SESSION_ID);

  return `POESESSID=${poeSessionId}`;
};
