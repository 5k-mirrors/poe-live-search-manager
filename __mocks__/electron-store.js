class ElectronStore {
  constructor() {
    this.store = {};
  }

  get(key, defaultValue) {
    if (this.store[key]) {
      return this.store[key];
    }

    return defaultValue;
  }

  set(key, value) {
    this.store[key] = value;
  }

  clear() {
    this.store = {};
  }
}

export default ElectronStore;
