import { globalStore } from "../../GlobalStore/GlobalStore";
import * as javaScriptUtils from "../JavaScriptUtils/JavaScriptUtils";

export const deleteItem = storeKey => {
  const storeItem = globalStore.get(storeKey);

  if (javaScriptUtils.isDefined(storeItem)) {
    globalStore.delete(storeKey);
  }
};
