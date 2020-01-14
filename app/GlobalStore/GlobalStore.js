import Store from "electron-store";

export default class SingletonGlobalStore {
  constructor() {
    if (!SingletonGlobalStore.instance) {
      SingletonGlobalStore.instance = new Store();
    }

    return SingletonGlobalStore.instance;
  }
}
