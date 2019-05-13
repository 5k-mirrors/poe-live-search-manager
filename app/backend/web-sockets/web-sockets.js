class WebSockets {
  constructor() {
    this.wsStorage = [];
  }

  add(connectionDetails) {
    this.wsStorage.push({
      ...connectionDetails
    });
  }

  updateWithSocket(id, socket) {
    const webSocketIndex = this.wsStorage.findIndex(
      webSocket => webSocket.id === id
    );

    this.wsStorage[webSocketIndex] = {
      ...this.wsStorage[webSocketIndex],
      socket
    };
  }

  get(id) {
    return this.wsStorage.find(webSocket => webSocket.id === id);
  }

  getStorage() {
    return [...this.wsStorage];
  }

  remove(id) {
    const webSocketIndex = this.wsStorage.findIndex(
      webSocket => webSocket.id === id
    );

    this.wsStorage.splice(webSocketIndex, 1);
  }
}

export default WebSockets;
