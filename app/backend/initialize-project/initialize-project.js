import { ipcMain } from "electron";
import * as WebSocketActions from "../web-sockets/actions/actions";
import * as JavaScriptUtils from "../../utils/JavaScriptUtils/JavaScriptUtils";
import { globalStore } from "../../GlobalStore/GlobalStore";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";
import { storeKeys } from "../../resources/StoreKeys/StoreKeys";

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
  const poeSessionId = globalStore.get(storeKeys.POE_SESSION_ID, "");

  // Is it necessary to check whether the ID exists? IMO it's not.
  if (JavaScriptUtils.isDefined(poeSessionId)) {
    globalStore.delete(storeKeys.POE_SESSION_ID);
  }
};

const setupIpcEvents = () => {
  ipcMain.on(ipcEvents.WS_CONNECT, (event, connectionDetails) => {
    // const isLoggedIn = globalStore.get("isLoggedIn", false);
    const isLoggedIn = globalStore.get(storeKeys.IS_LOGGED_IN, false);

    if (isLoggedIn) {
      WebSocketActions.connectToNewWebSocket(connectionDetails);
    }
  });

  ipcMain.on(ipcEvents.WS_DISCONNECT, (event, connectionDetails) => {
    // const isLoggedIn = globalStore.get("isLoggedIn", false);
    const isLoggedIn = globalStore.get(storeKeys.IS_LOGGED_IN, false);

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
