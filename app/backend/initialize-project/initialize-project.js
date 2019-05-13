import { ipcMain } from "electron";
import * as WebSocketActions from "../web-sockets/actions/actions";
import { globalStore } from "../../GlobalStore/GlobalStore";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";
import { storeKeys } from "../../resources/StoreKeys/StoreKeys";
import * as JavaScriptUtils from "../../utils/JavaScriptUtils/JavaScriptUtils";

const connectToStoredWebSockets = () => {
  // const storedWsConnections = globalStore.get("wsConnections", []);
  const storedWsConnections = globalStore.get(storeKeys.WS_CONNECTIONS, []);

  storedWsConnections.forEach(connectionDetails => {
    WebSocketActions.connectToNewWebSocket(connectionDetails);
  });
};

const disconnectFromStoredWebSockets = () => {
  // const storedWsConnections = globalStore.get("wsConnections", []);
  const storedWsConnections = globalStore.get(storeKeys.WS_CONNECTIONS, []);

  storedWsConnections.forEach(connectionDetails => {
    WebSocketActions.disconnectFromWebSocket(connectionDetails);
  });
};

// GLOBAL @TODO: let's create constants to access the elements in the `globalStore`.

const clearPoeSessionId = () => {
  // const poeSessionId = globalStore.get("POESESSID");
  const poeSessionId = globalStore.get(storeKeys.POE_SESSION_ID);

  // Is it necessary to check whether the ID exists? IMO it's not.
  if (JavaScriptUtils.isDefined(poeSessionId)) {
    globalStore.delete(storeKeys.POE_SESSION_ID);
  }
};

const setupIpcEvents = () => {
  ipcMain.on(ipcEvents.WS_CONNECT, (event, connectionDetails) => {
    // const socketsConnected = globalStore.get("socketsConnected", false);
    const socketsConnected = globalStore.get(
      storeKeys.SOCKETS_CONNECTED,
      false
    );

    if (socketsConnected) {
      WebSocketActions.connectToNewWebSocket(connectionDetails);
    }
  });

  ipcMain.on(ipcEvents.WS_DISCONNECT, (event, connectionDetails) => {
    // const socketsConnected = globalStore.get("socketsConnected", false);
    const socketsConnected = globalStore.get(
      storeKeys.SOCKETS_CONNECTED,
      false
    );

    if (socketsConnected) {
      WebSocketActions.disconnectFromWebSocket(connectionDetails);
    }
  });

  ipcMain.on(ipcEvents.USER_LOGIN, () => {
    // globalStore.set("socketsConnected", true);
    globalStore.set(storeKeys.SOCKETS_CONNECTED, true);

    connectToStoredWebSockets();
  });

  ipcMain.on(ipcEvents.USER_LOGOUT, () => {
    clearPoeSessionId();
    // globalStore.set("socketsConnected", false);
    globalStore.set(storeKeys.SOCKETS_CONNECTED, false);

    disconnectFromStoredWebSockets();
  });
};

const initializeProject = () => {
  setupIpcEvents();
};

export default initializeProject;
