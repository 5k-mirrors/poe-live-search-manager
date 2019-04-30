import { ipcMain, Notification } from "electron";
import WebSocket from "ws";
import { ipcEvents } from "../../../frontend/resources/IPCEvents/IPCEvents";
import WebSocketConnectionsStorage from "../../WebSocketConnectionsStorage/WebSocketConnectionsStorage";

const webSocketConnectionsStorage = new WebSocketConnectionsStorage();

const doNotify = ({ notificationMessage }) => {
  new Notification({
    title: "PoE Sniper Pro",
    body: notificationMessage
  }).show();
};

const setupWebSocketEventListeners = (webSocket, wsConnectionParams) => {
  webSocket.on("open", () => {
    webSocketConnectionsStorage.add(webSocket, wsConnectionParams.id);
  });

  webSocket.on("close", () => {
    // console.log("[CONNECTION HAS BEEN CLOSED]");
  });

  webSocket.on("message", message => {
    doNotify({
      notificationMessage: message
    });
  });
};

export const setupEvents = () => {
  ipcMain.on(ipcEvents.CONNECT_TO_WS, (_, wsConnectionParams) => {
    const webSocket = new WebSocket(wsConnectionParams.URI);

    setupWebSocketEventListeners(webSocket, wsConnectionParams);
  });

  ipcMain.on(ipcEvents.DISCONNECT_FROM_WS, (_, wsConnectionParams) => {
    webSocketConnectionsStorage.remove(wsConnectionParams.id);
  });
};
