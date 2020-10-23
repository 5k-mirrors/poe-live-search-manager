import GlobalStore from "../../GlobalStore/GlobalStore";

export const clear = storeKey => {
  const globalStore = GlobalStore.getInstance();

  if (globalStore.has(storeKey)) {
    globalStore.delete(storeKey);
  }
};

export const isEnabled = (storeKey, defaultValue = true) => {
  const globalStore = GlobalStore.getInstance();

  const value = globalStore.get(storeKey, defaultValue);

  return typeof value === "boolean" && value === true;
};
