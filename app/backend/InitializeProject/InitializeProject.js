import { ipcMain } from "electron";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";
import * as WebSocketActions from "../WebSockets/Actions/Actions";
import { globalStore } from "../../GlobalStore/GlobalStore";
import * as JavaScriptUtils from "../../utils/JavaScriptUtils/JavaScriptUtils";

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

// GLOBAL @TODO: let's create constants to access the elements in the `globalStore`.

const clearPoeSessionId = () => {
  const poeSessionId = globalStore.get("POESESSID");

  if (JavaScriptUtils.isDefined(poeSessionId)) {
    globalStore.delete("");
  }
};

const setupIpcEvents = () => {
  ipcMain.on(ipcEvents.WS_CONNECT, (event, connectionDetails) => {
    const isLoggedIn = globalStore.get("isLoggedIn", false);

    if (isLoggedIn) {
      WebSocketActions.connectToNewWebSocket(connectionDetails);
    }
  });

  ipcMain.on(ipcEvents.WS_DISCONNECT, (event, connectionDetails) => {
    const isLoggedIn = globalStore.get("isLoggedIn", false);

    if (isLoggedIn) {
      WebSocketActions.disconnectFromWebSocket(connectionDetails);
    }
  });

  ipcMain.on(ipcEvents.USER_LOGIN, () => {
    connectToStoredWebSockets();
  });

  ipcMain.on(ipcEvents.USER_LOGOUT, () => {
    clearPoeSessionId();

    disconnectFromStoredWebSockets();
  });
};

const initializeProject = () => {
  setupIpcEvents();
};

export default initializeProject;
