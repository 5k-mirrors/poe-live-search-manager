import Store from "electron-store";

const store = new Store();

export const getItem = key => store.get(key) || [];

export const setItem = (key, item) => store.set(key, item);
