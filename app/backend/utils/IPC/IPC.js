import { ipcMain, Notification } from "electron";
import WebSocket from "ws";
import { ipcEvents } from "../../../frontend/resources/IPCEvents/IPCEvents";
import WsConnectionsStorage from "../../WsConnectionsStorage/WsConnectionsStorage";

const wsConnectionsStorage = new WsConnectionsStorage();

const doNotify = ({ notificationMessage }) => {
  new Notification({
    title: "PoE Sniper Pro",
    body: notificationMessage
  }).show();
};

const setupWebSocketListeners = (webSocket, wsConnectionDetails) => {
  webSocket.on("open", () => {
    wsConnectionsStorage.add(webSocket, wsConnectionDetails.id);
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
  ipcMain.on(ipcEvents.CONNECT_TO_WS, (_, wsConnectionDetails) => {
    const webSocket = new WebSocket(wsConnectionDetails.URI);

    setupWebSocketListeners(webSocket, wsConnectionDetails);
  });

  ipcMain.on(ipcEvents.DISCONNECT_FROM_WS, (_, wsConnectionDetails) => {
    wsConnectionsStorage.remove(wsConnectionDetails.id);
  });
};
