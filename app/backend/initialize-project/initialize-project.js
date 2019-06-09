import { ipcMain } from "electron";
import { globalStore } from "../../GlobalStore/GlobalStore";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";
import { storeKeys } from "../../resources/StoreKeys/StoreKeys";
import * as storeUtils from "../../utils/StoreUtils/StoreUtils";
import * as webSocketActions from "../web-sockets/actions";
import store from "../web-sockets/store";
import subscription from "../../Subscription/Subscription";

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

// TODO: whenever the subscription expires, the app will receive an event in which the `paying` field will be updated in the DB.
// As a result, we should listen to that change and handle this event gracefully - e.g. disconnect from WebSockets etc.
const setupIpcEvents = () => {
  ipcMain.on(ipcEvents.WS_ADD, (event, connectionDetails) => {
    store.add(connectionDetails);

    const isLoggedIn = globalStore.get(storeKeys.IS_LOGGED_IN, false);

    if (isLoggedIn) {
      if (subscription.active()) {
        webSocketActions.connect(connectionDetails.id);
      }
    }
  });

  ipcMain.on(ipcEvents.WS_REMOVE, (event, connectionDetails) => {
    const isLoggedIn = globalStore.get(storeKeys.IS_LOGGED_IN, false);

    if (isLoggedIn) {
      webSocketActions.disconnect(connectionDetails.id);
    }

    store.remove(connectionDetails.id);
  });

  ipcMain.on(ipcEvents.USER_LOGIN, () => {
    if (subscription.active()) {
      connectToStoredWebSockets();
    }
  });

  ipcMain.on(ipcEvents.USER_LOGOUT, () => {
    storeUtils.deleteIfExists(storeKeys.POE_SESSION_ID);

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
