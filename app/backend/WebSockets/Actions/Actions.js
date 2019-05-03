import WebSocket from "ws";
import WebSockets from "../WebSockets";
import * as JavaScriptUtils from "../../utils/JavaScriptUtils/JavaScriptUtils";
import setupWebSocketListeners from "../../utils/SetupWebSocketListeners/SetupWebSocketListeners";

const webSockets = new WebSockets();

export const connectToNewWebSocket = connectionDetails => {
  const newWebSocket = new WebSocket(connectionDetails.URI);

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

export const reconnectToWebSockets = wsConnections => {
  if (JavaScriptUtils.isDefined(wsConnections)) {
    wsConnections.forEach(connectionDetails => {
      connectToNewWebSocket(connectionDetails);
    });
  }
};
