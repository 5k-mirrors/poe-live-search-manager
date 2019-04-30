import { ipcMain, Notification } from "electron";
import WebSocket from "ws";
import { ipcEvents } from "../../IPCEvents/IPCEvents";
import ActiveWsConnections from "../ActiveWsConnections/ActiveWsConnections";

const activeWsConnections = new ActiveWsConnections();

const doNotify = ({ notificationMessage }) => {
  new Notification({
    title: "PoE Sniper Pro",
    body: notificationMessage
  }).show();
};

const setupWebSocketListeners = (webSocket, wsConnectionDetails) => {
  webSocket.on("open", () => {
    activeWsConnections.add(webSocket, wsConnectionDetails.id);
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
    const connection = activeWsConnections.getConnection(
      wsConnectionDetails.id
    );

    connection.webSocket.close();

    activeWsConnections.remove(connection.id);
  });
};
