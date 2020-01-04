import { globalStore } from "../../GlobalStore/GlobalStore";

export const clear = storeKey => {
  if (globalStore.has(storeKey)) {
    globalStore.delete(storeKey);
  }
};

export const isEnabled = (storeKey, defaultValue = true) => {
  const value = globalStore.get(storeKey, defaultValue);

  return typeof value === "boolean" && value === true;
};
