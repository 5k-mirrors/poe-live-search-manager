import { ipcMain } from "electron";
import { globalStore } from "../../GlobalStore/GlobalStore";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";
import { storeKeys } from "../../resources/StoreKeys/StoreKeys";
import * as storeUtils from "../../utils/StoreUtils/StoreUtils";
import * as webSocketActions from "../web-sockets/actions";
import * as subscriptionActions from "../../Subscription/Actions";
import store from "../web-sockets/store";

const setupIpcEvents = () => {
  ipcMain.on(ipcEvents.WS_ADD, (event, connectionDetails) => {
    store.add(connectionDetails);

    const isLoggedIn = globalStore.get(storeKeys.IS_LOGGED_IN, false);

    if (isLoggedIn) {
      webSocketActions.updateConnections();
    }
  });

  ipcMain.on(ipcEvents.WS_REMOVE, (event, connectionDetails) => {
    const isLoggedIn = globalStore.get(storeKeys.IS_LOGGED_IN, false);

    if (isLoggedIn) {
      webSocketActions.disconnect(connectionDetails.id);
    }

    store.remove(connectionDetails.id);
  });

  ipcMain.on(ipcEvents.USER_LOGIN, (event, id) => {
    subscriptionActions.startSubscriptionRefreshInterval(id);
  });

  ipcMain.on(ipcEvents.USER_LOGOUT, () => {
    subscriptionActions.stopSubscriptionRefreshInterval();

    webSocketActions.disconnectFromStoredWebSockets();

    storeUtils.deleteIfExists(storeKeys.POE_SESSION_ID);
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
