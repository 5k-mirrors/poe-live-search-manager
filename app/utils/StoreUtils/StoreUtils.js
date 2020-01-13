import SingletonGlobalStore from "../../GlobalStore/GlobalStore";

export const clear = storeKey => {
  const globalStore = new SingletonGlobalStore();

  if (globalStore.has(storeKey)) {
    globalStore.delete(storeKey);
  }
};

export const isEnabled = (storeKey, defaultValue = true) => {
  const globalStore = new SingletonGlobalStore();

  const value = globalStore.get(storeKey, defaultValue);

  return typeof value === "boolean" && value === true;
};
