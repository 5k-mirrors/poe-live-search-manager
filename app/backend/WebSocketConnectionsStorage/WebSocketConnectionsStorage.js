class WebSocketConnectionsStorage {
  constructor() {
    this.activeWsConnections = [];
  }

  add(webSocket, connetionId) {
    this.activeWsConnections.push({
      id: connetionId,
      webSocket
    });
  }

  remove(connectionId) {
    const connectionIndex = this.activeWsConnections.findIndex(
      connection => connection.id === connectionId
    );

    const connectionExists = connectionIndex > -1;

    if (connectionExists) {
      this.activeWsConnections[connectionIndex].webSocket.close();

      this.activeWsConnections.splice(connectionIndex, 1);
    }
  }
}

export default WebSocketConnectionsStorage;
