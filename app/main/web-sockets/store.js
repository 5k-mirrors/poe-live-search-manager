import GlobalStore from "../../shared/GlobalStore/GlobalStore";
import { storeKeys } from "../../resources/StoreKeys/StoreKeys";

export default class Store {
  static sockets = [];

  static add(connectionDetails) {
    this.sockets.push({
      ...connectionDetails,
    });
  }

  static update(id, data) {
    const index = this.sockets.findIndex(socket => socket.id === id);

    this.sockets[index] = {
      ...this.sockets[index],
      ...data,
    };
  }

  static find(id) {
    return this.sockets.find(socket => socket.id === id);
  }

  static remove(id) {
    const index = this.sockets.findIndex(socket => socket.id === id);

    this.sockets.splice(index, 1);
  }

  static sanitized() {
    return this.sockets.map(
      ({ socket, ...remainingSocketDetails }) => remainingSocketDetails
    );
  }

  static clear() {
    // https://stackoverflow.com/a/1232046/9599137
    this.sockets.splice(0, this.sockets.length);
  }

  static load() {
    const globalStore = GlobalStore.getInstance();

    const localSearches = globalStore.get(storeKeys.WS_CONNECTIONS, []);

    localSearches.forEach(searchDetails => {
      this.add(searchDetails);
    });
  }
}
