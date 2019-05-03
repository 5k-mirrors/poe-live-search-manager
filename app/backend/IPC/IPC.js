import { ipcMain, Notification } from "electron";
import WebSocket from "ws";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";
import WebSockets from "../WebSockets/WebSockets";

const webSockets = new WebSockets();

const doNotify = ({ notificationMessage }) => {
  new Notification({
    title: "PoE Sniper Pro",
    body: notificationMessage
  }).show();
};

const setupWebSocketListeners = (webSocket, wsConnectionDetails) => {
  webSocket.on("open", () => {
    webSockets.addNewWebSocket(webSocket, wsConnectionDetails.id);
  });

  webSocket.on("close", () => {
    console.log("[CONNECTION HAS BEEN CLOSED]");
  });

  webSocket.on("message", message => {
    doNotify({
      notificationMessage: message
    });
  });
};

export const setupEvents = () => {
  ipcMain.on(ipcEvents.WS_CONNECT, (_, wsConnectionDetails) => {
    const webSocket = new WebSocket(wsConnectionDetails.URI);

    setupWebSocketListeners(webSocket, wsConnectionDetails);
  });

  ipcMain.on(ipcEvents.WS_DISCONNECT, (_, wsConnectionDetails) => {
    const webSocket = webSockets.getWebSocket(wsConnectionDetails.id);

    webSocket.WS.close();

    webSockets.removeWebSocket(webSocket.id);
  });
};
