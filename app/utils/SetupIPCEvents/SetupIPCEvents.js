import { ipcMain } from "electron";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";
import * as WebSocketActions from "../../backend/WebSockets/Actions/Actions";

export const backend = () => {
  ipcMain.on(ipcEvents.WS_CONNECT, (_, connectionDetails) => {
    WebSocketActions.connectToNewWebSocket(connectionDetails);
  });

  ipcMain.on(ipcEvents.WS_DISCONNECT, (_, connectionDetails) => {
    WebSocketActions.disconnectFromWebSocket(connectionDetails);
  });
};
