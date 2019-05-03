import Store from "electron-store";
import WebSocket from "ws";
import WebSockets from "../WebSockets";
import * as JavaScriptUtils from "../../utils/JavaScriptUtils/JavaScriptUtils";
import setupWebSocketListeners from "../../utils/SetupWebSocketListeners/SetupWebSocketListeners";

const webSockets = new WebSockets();
const store = new Store();

export const connectToNewWebSocket = wsConnectionDetails => {
  const newWebSocket = new WebSocket(wsConnectionDetails.URI);

  newWebSocket.on("open", () => {
    webSockets.addNewWebSocket(newWebSocket, wsConnectionDetails.id);

    setupWebSocketListeners(newWebSocket);
  });
};

export const disconnectFromWebSocket = wsConnectionDetails => {
  const ws = webSockets.getWebSocketById(wsConnectionDetails.id);

  ws.socket.close();

  webSockets.removeWebSocket(ws.id);
};

export const reconnectToWebSockets = () => {
  const wsConnectionsDetails = store.get("wsConnectionsDetails");

  if (JavaScriptUtils.isDefined(wsConnectionsDetails)) {
    wsConnectionsDetails.forEach(connectionDetails => {
      connectToNewWebSocket(connectionDetails);
    });
  }
};
