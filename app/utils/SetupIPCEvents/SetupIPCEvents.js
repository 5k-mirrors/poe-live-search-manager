import { ipcMain, ipcRenderer } from "electron";
import { store } from "../../resources/Store/Store";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";
import * as WebSocketActions from "../../backend/WebSockets/Actions/Actions";

export const frontend = () => {
  ipcRenderer.on(ipcEvents.ON_MESSAGE, (_, message) => {
    const parsedMessage = JSON.parse(message);

    const currentMessages = store.get("messages") || [];

    currentMessages.unshift(parsedMessage);

    store.set("messages", currentMessages);
  });
};

export const backend = () => {
  ipcMain.on(ipcEvents.WS_CONNECT, (_, connectionDetails) => {
    WebSocketActions.connectToNewWebSocket(connectionDetails);
  });

  ipcMain.on(ipcEvents.WS_DISCONNECT, (_, connectionDetails) => {
    WebSocketActions.disconnectFromWebSocket(connectionDetails);
  });
};
