class WebSockets {
  constructor() {
    this.wsStorage = [];
  }

  addNewWebSocket(webSocket, webSocketId) {
    this.wsStorage.push({
      id: webSocketId,
      socket: webSocket
    });
  }

  getWebSocketById(webSocketId) {
    return this.wsStorage.find(webSocket => webSocket.id === webSocketId);
  }

  removeWebSocket(webSocketId) {
    const webSocketIndex = this.wsStorage.findIndex(
      webSocket => webSocket.id === webSocketId
    );

    this.wsStorage.splice(webSocketIndex, 1);
  }
}

export default WebSockets;
