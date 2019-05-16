import { globalStore } from "../../GlobalStore/GlobalStore";

export const deleteIfExists = storeKey => {
  if (globalStore.has(storeKey)) {
    globalStore.delete(storeKey);
  }
};
