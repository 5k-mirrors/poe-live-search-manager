class Store {
  constructor() {
    this.storage = [];
  }

  add(connectionDetails) {
    this.storage.push({
      ...connectionDetails,
      isConnected: false
    });
  }

  update(id, updatedData) {
    const wsElementIndex = this.storage.findIndex(ws => ws.id === id);

    this.storage[wsElementIndex] = {
      ...this.storage[wsElementIndex],
      ...updatedData
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

  removeSocket(id) {
    const wsElementIndex = this.storage.findIndex(ws => ws.id === id);

    delete this.storage[wsElementIndex].socket;
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
