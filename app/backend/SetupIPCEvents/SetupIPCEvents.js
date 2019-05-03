import { ipcMain } from "electron";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";
import * as WebSocketActions from "../WebSockets/Actions/Actions";

const setupIPCEvents = () => {
  ipcMain.on(ipcEvents.WS_CONNECT, (_, wsConnectionDetails) => {
    WebSocketActions.connectToNewWebSocket(wsConnectionDetails);
  });

  ipcMain.on(ipcEvents.WS_DISCONNECT, (_, wsConnectionDetails) => {
    WebSocketActions.disconnectFromWebSocket(wsConnectionDetails);
  });
};

export default setupIPCEvents;
