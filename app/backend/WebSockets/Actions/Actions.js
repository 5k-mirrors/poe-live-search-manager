import WebSocket from "ws";
import WebSockets from "../WebSockets";
import setupWebSocketListeners from "../../utils/SetupWebSocketListeners/SetupWebSocketListeners";

const webSockets = new WebSockets();

export const connectToNewWebSocket = connectionDetails => {
  const newWebSocket = new WebSocket(connectionDetails.uri);

  newWebSocket.on("open", () => {
    webSockets.addNewWebSocket(newWebSocket, connectionDetails.id);

    setupWebSocketListeners(newWebSocket);
  });
};

export const disconnectFromWebSocket = connectionDetails => {
  const ws = webSockets.getWebSocketById(connectionDetails.id);

  ws.socket.close();

  webSockets.removeWebSocket(ws.id);
};
