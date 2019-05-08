import { Notification } from "electron";
import WebSocket from "ws";
import WebSockets from "../WebSockets";

const webSockets = new WebSockets();

const doNotify = ({ notificationMessage }) => {
  new Notification({
    title: "PoE Sniper Pro",
    body: notificationMessage
  }).show();
};

const setupWebSocketListeners = webSocket => {
  webSocket.on("message", message => {
    doNotify({
      notificationMessage: message
    });
  });
};

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
