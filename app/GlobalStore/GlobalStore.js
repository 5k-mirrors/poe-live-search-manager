import ElectronStore from "electron-store";

export default class GlobalStore {
  static instance = null;

  static getInstance() {
    if (!this.instance) {
      this.instance = new ElectronStore({
        watch: true,
      });
    }

    return this.instance;
  }
}
