import { ipcMain } from "electron";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";
import * as WebSocketActions from "../web-sockets/actions/actions";
import { globalStore } from "../../GlobalStore/GlobalStore";
import { storedWebSockets } from "../../StoredWebSockets/StoredWebSockets";

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

const setupIpcEvents = () => {
  ipcMain.on(ipcEvents.WS_ADD, (event, connectionDetails) => {
    storedWebSockets.add(connectionDetails);

    const isLoggedIn = globalStore.get("isLoggedIn", false);

    if (isLoggedIn) {
      WebSocketActions.connectToWebSocket(connectionDetails);
    }
  });

  ipcMain.on(ipcEvents.WS_REMOVE, (event, connectionDetails) => {
    const isLoggedIn = globalStore.get("isLoggedIn", false);

    if (isLoggedIn) {
      WebSocketActions.disconnectFromWebSocket(connectionDetails.id);
    }

    WebSocketActions.removeWebSocket(connectionDetails.id);
  });

  ipcMain.on(ipcEvents.USER_LOGIN, () => {
    connectToStoredWebSockets();
  });

  ipcMain.on(ipcEvents.USER_LOGOUT, () => {
    disconnectFromStoredWebSockets();
  });
};

const loadLocallySavedWsConnectionsIntoStore = () => {
  const locallySavedWsConnections = globalStore.get("wsConnections", []);

  locallySavedWsConnections.forEach(connectionDetails => {
    storedWebSockets.add(connectionDetails);
  });
};

const initializeProject = () => {
  loadLocallySavedWsConnectionsIntoStore();

  setupIpcEvents();
};

export default initializeProject;
