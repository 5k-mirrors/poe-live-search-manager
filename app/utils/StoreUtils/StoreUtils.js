import { globalStore } from "../../GlobalStore/GlobalStore";

export const clear = storeKey => {
  if (globalStore.has(storeKey)) {
    globalStore.delete(storeKey);
  }
};
