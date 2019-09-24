import { globalStore } from "../../GlobalStore/GlobalStore";
import { storeKeys } from "../../resources/StoreKeys/StoreKeys";

class Store {
  constructor() {
    this.storage = [];
  }

  add(connectionDetails) {
    this.storage.push({
      ...connectionDetails,
      isConnected: false,
    });
  }

  update(id, updatedData) {
    const wsElementIndex = this.storage.findIndex(ws => ws.id === id);

    this.storage[wsElementIndex] = {
      ...this.storage[wsElementIndex],
      ...updatedData,
    };
  }

  find(id) {
    return this.storage.find(ws => ws.id === id);
  }

  all() {
    return [...this.storage];
  }

  remove(id) {
    const wsElementIndex = this.storage.findIndex(ws => ws.id === id);

    this.storage.splice(wsElementIndex, 1);
  }

  sanitized() {
    return this.all().map(
      ({ socket, isConnected, ...remainingSocketDetails }) =>
        remainingSocketDetails
    );
  }

  clear() {
    // https://stackoverflow.com/a/1232046/9599137
    this.storage.splice(0, this.storage.length);
  }

  load() {
    /* The store must be emptied beforehand, otherwise FE hot-reload causes dudplicated items. */
    this.clear();

    const localSearches = globalStore.get(storeKeys.WS_CONNECTIONS, []);

    localSearches.forEach(searchDetails => {
      this.add(searchDetails);
    });
  }

  open(id) {
    const ws = this.find(id);

    // if (!ws) return false???

    return ws.socket && ws.socket.readyState === 1;
  }

  closed(id) {
    const ws = this.find(id);

    // if (!ws) return false???;

    return ws.socket && ws.socket.readyState === 3;
  }
}

class SingletonStore {
  constructor() {
    if (!SingletonStore.instance) {
      SingletonStore.instance = new Store();
    }

    return SingletonStore.instance;
  }
}

const singletonStore = new SingletonStore();

export default singletonStore;
