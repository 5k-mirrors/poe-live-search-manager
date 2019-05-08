import { ipcMain, Notification } from "electron";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";
import * as WebSocketActions from "../WebSockets/Actions/Actions";

export const ipcListeners = () => {
  ipcMain.on(ipcEvents.WS_CONNECT, (_, connectionDetails) => {
    WebSocketActions.connectToNewWebSocket(connectionDetails);
  });

  ipcMain.on(ipcEvents.WS_DISCONNECT, (_, connectionDetails) => {
    WebSocketActions.disconnectFromWebSocket(connectionDetails);
  });
};

const doNotify = ({ notificationMessage }) => {
  new Notification({
    title: "PoE Sniper Pro",
    body: notificationMessage
  }).show();
};

export const webSocketListeners = webSocket => {
  webSocket.on("message", message => {
    doNotify({
      notificationMessage: message
    });
  });
};
