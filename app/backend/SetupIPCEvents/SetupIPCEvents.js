import { ipcMain } from "electron";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";
import * as WebSocketActions from "../WebSockets/Actions/Actions";

const setupIPCEvents = () => {
  ipcMain.on(ipcEvents.WS_CONNECT, (_, connectionDetails) => {
    WebSocketActions.connectToNewWebSocket(connectionDetails);
  });

  ipcMain.on(ipcEvents.WS_DISCONNECT, (_, connectionDetails) => {
    WebSocketActions.disconnectFromWebSocket(connectionDetails);
  });
};

export default setupIPCEvents;
