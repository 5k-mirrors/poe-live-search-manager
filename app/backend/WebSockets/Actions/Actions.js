import WebSocket from "ws";
import WebSockets from "../WebSockets";
import setupWebSocketListeners from "../../SetupWebSocketListeners/SetupWebSocketListeners";

const webSockets = new WebSockets();

export const connectToNewWebSocket = connectionDetails => {
  const newWebSocket = new WebSocket(connectionDetails.uri);

  newWebSocket.on("open", () => {
    webSockets.add(newWebSocket, connectionDetails.id);

    setupWebSocketListeners(newWebSocket);
  });
};

export const disconnectFromWebSocket = connectionDetails => {
  const ws = webSockets.get(connectionDetails.id);

  ws.socket.close();

  webSockets.remove(ws.id);
};
