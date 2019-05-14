class Store {
  constructor() {
    if (!Store.instance) {
      Store.instance = this;
    }

    this.storage = [];

    return Store.instance;
  }

  add(connectionDetails) {
    this.storage.push({
      ...connectionDetails
    });
  }

  update(id, socket) {
    const wsElementIndex = this.storage.findIndex(ws => ws.id === id);

    this.storage[wsElementIndex] = {
      ...this.storage[wsElementIndex],
      socket
    };
  }

  get(id) {
    return this.storage.find(ws => ws.id === id);
  }

  all() {
    return [...this.storage];
  }

  remove(id) {
    const wsElementIndex = this.storage.findIndex(ws => ws.id === id);

    this.storage.splice(wsElementIndex, 1);
  }
}

const storeInstance = new Store();
Object.freeze(storeInstance);

export default storeInstance;
