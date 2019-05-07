class WebSockets {
  constructor() {
    this.wsStorage = [];
  }

  add(webSocket, id) {
    this.wsStorage.push({
      id,
      socket: webSocket
    });
  }

  get(id) {
    return this.wsStorage.find(webSocket => webSocket.id === id);
  }

  remove(id) {
    const webSocketIndex = this.wsStorage.findIndex(
      webSocket => webSocket.id === id
    );

    this.wsStorage.splice(webSocketIndex, 1);
  }
}

export default WebSockets;
