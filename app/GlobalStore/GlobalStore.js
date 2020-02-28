import Store from "electron-store";

export default class SingletonGlobalStore {
  constructor() {
    if (!SingletonGlobalStore.instance) {
      SingletonGlobalStore.instance = new Store({
        watch: true,
      });
    }

    return SingletonGlobalStore.instance;
  }
}
