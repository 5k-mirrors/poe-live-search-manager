import { ipcMain } from "electron";
import { globalStore } from "../../GlobalStore/GlobalStore";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";
import { storeKeys } from "../../resources/StoreKeys/StoreKeys";
import * as JavaScriptUtils from "../../utils/JavaScriptUtils/JavaScriptUtils";
import * as webSocketActions from "../web-sockets/actions";
import store from "../web-sockets/store";

const connectToStoredWebSockets = () => {
  store.all().forEach(connectionDetails => {
    webSocketActions.connect(connectionDetails.id);
  });
};

const disconnectFromStoredWebSockets = () => {
  store.all().forEach(connectionDetails => {
    webSocketActions.disconnect(connectionDetails.id);
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
    store.add(connectionDetails);

    const isLoggedIn = globalStore.get(storeKeys.IS_LOGGED_IN, false);

    if (isLoggedIn) {
      webSocketActions.connect(connectionDetails.id);
    }
  });

  ipcMain.on(ipcEvents.WS_REMOVE, (event, connectionDetails) => {
    const isLoggedIn = globalStore.get("isLoggedIn", false);

    if (isLoggedIn) {
      webSocketActions.disconnect(connectionDetails.id);
    }

    store.remove(connectionDetails.id);
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
    store.add(connectionDetails);
  });
};

const initializeProject = () => {
  loadLocallySavedWsConnectionsIntoStore();

  setupIpcEvents();
};

export default initializeProject;
