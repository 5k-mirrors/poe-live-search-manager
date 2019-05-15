import { globalStore } from "../../GlobalStore/GlobalStore";
import * as JavaScriptUtils from "../JavaScriptUtils/JavaScriptUtils";

export const deleteItem = storeKey => {
  const storeItem = globalStore.get(storeKey);

  if (JavaScriptUtils.isDefined(storeItem)) {
    globalStore.delete(storeKey);
  }
};
