class ActiveWsConnections {
  constructor() {
    this.storage = [];
  }

  add(webSocket, connetionId) {
    this.storage.push({
      id: connetionId,
      webSocket
    });
  }

  getConnection(connectionId) {
    return this.storage.find(connection => connection.id === connectionId);
  }

  remove(connectionId) {
    const connectionIndex = this.storage.findIndex(
      connection => connection.id === connectionId
    );

    this.storage.splice(connectionIndex, 1);
  }
}

export default ActiveWsConnections;
