import { ipcMain } from "electron";
import * as WebSocketActions from "../web-sockets/actions/actions";
import { globalStore } from "../../GlobalStore/GlobalStore";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";
import { storeKeys } from "../../resources/StoreKeys/StoreKeys";
import { storedWebSockets } from "../../StoredWebSockets/StoredWebSockets";
import * as JavaScriptUtils from "../../utils/JavaScriptUtils/JavaScriptUtils";

const connectToStoredWebSockets = () => {
  const storage = storedWebSockets.getStorage();

  storage.forEach(connectionDetails => {
    WebSocketActions.connectToWebSocket(connectionDetails);
  });
};

const disconnectFromStoredWebSockets = () => {
  const storage = storedWebSockets.getStorage();

  storage.forEach(connectionDetails => {
    WebSocketActions.disconnectFromWebSocket(connectionDetails.id);
  });
};

const clearPoeSessionId = () => {
  const poeSessionId = globalStore.get(storeKeys.POE_SESSION_ID);

  if (JavaScriptUtils.isDefined(poeSessionId)) {
    globalStore.delete(storeKeys.POE_SESSION_ID);
  }
};

const setupIpcEvents = () => {
  ipcMain.on(ipcEvents.WS_ADD, (event, connectionDetails) => {
    storedWebSockets.add(connectionDetails);

    const isLoggedIn = globalStore.get(storeKeys.IS_LOGGED_IN, false);

    if (isLoggedIn) {
      WebSocketActions.connectToWebSocket(connectionDetails);
    }
  });

  ipcMain.on(ipcEvents.WS_REMOVE, (event, connectionDetails) => {
    const { id } = connectionDetails;

    WebSocketActions.disconnectFromWebSocket(id);

    WebSocketActions.removeWebSocket(id);
  });

  ipcMain.on(ipcEvents.USER_LOGIN, () => {
    connectToStoredWebSockets();
  });

  ipcMain.on(ipcEvents.USER_LOGOUT, () => {
    clearPoeSessionId();

    disconnectFromStoredWebSockets();
  });
};

const loadLocallySavedWsConnectionsIntoStore = () => {
  const locallySavedWsConnections = globalStore.get(
    storeKeys.WS_CONNECTIONS,
    []
  );

  locallySavedWsConnections.forEach(connectionDetails => {
    storedWebSockets.add(connectionDetails);
  });
};

const initializeProject = () => {
  loadLocallySavedWsConnectionsIntoStore();

  setupIpcEvents();
};

export default initializeProject;
