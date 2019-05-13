import { ipcMain } from "electron";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";
import * as WebSocketActions from "../web-sockets/actions/actions";
import { globalStore } from "../../GlobalStore/GlobalStore";

const connectToStoredWebSockets = () => {
  const storedWsConnections = globalStore.get("wsConnections", []);

  storedWsConnections.forEach(connectionDetails => {
    WebSocketActions.connectToNewWebSocket(connectionDetails);
  });
};

const disconnectFromStoredWebSockets = () => {
  const storedWsConnections = globalStore.get("wsConnections", []);

  storedWsConnections.forEach(connectionDetails => {
    WebSocketActions.disconnectFromWebSocket(connectionDetails);
  });
};

const setupIpcEvents = () => {
  ipcMain.on(ipcEvents.WS_CONNECT, (event, connectionDetails) => {
    const socketsConnected = globalStore.get("socketsConnected", false);

    if (socketsConnected) {
      WebSocketActions.connectToNewWebSocket(connectionDetails);
    }
  });

  ipcMain.on(ipcEvents.WS_DISCONNECT, (event, connectionDetails) => {
    const socketsConnected = globalStore.get("socketsConnected", false);

    if (socketsConnected) {
      WebSocketActions.disconnectFromWebSocket(connectionDetails);
    }
  });

  ipcMain.on(ipcEvents.USER_LOGIN, () => {
    globalStore.set("socketsConnected", true);

    connectToStoredWebSockets();
  });

  ipcMain.on(ipcEvents.USER_LOGOUT, () => {
    globalStore.set("socketsConnected", false);

    disconnectFromStoredWebSockets();
  });
};

const initializeProject = () => {
  setupIpcEvents();
};

export default initializeProject;
