import { ipcMain } from "electron";
import { globalStore } from "../../GlobalStore/GlobalStore";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";
import { storeKeys } from "../../resources/StoreKeys/StoreKeys";
import * as storeUtils from "../../utils/StoreUtils/StoreUtils";
import * as webSocketActions from "../web-sockets/actions";
import * as subscriptionActions from "../../Subscription/Actions";
import store from "../web-sockets/store";

const updateGlobalStoreWebSocketConnections = () => {
  const sanitizedStore = store
    .all()
    .map(
      ({ socket, isConnected, ...remainingSocketDetails }) =>
        remainingSocketDetails
    );

  globalStore.set(storeKeys.WS_CONNECTIONS, sanitizedStore);
};

const setupIpcEvents = () => {
  // @TODO => setupStoreIpcEvents()?
  ipcMain.on(ipcEvents.STORE_REQUEST, event => {
    const sanitizedStore = store
      .all()
      .map(({ socket, ...remainingSocketDetails }) => remainingSocketDetails);

    event.sender.send(ipcEvents.STORE_RESPONSE, sanitizedStore);
  });

  // @TODO => setupWebSocketIpcEvents()?
  ipcMain.on(ipcEvents.WS_ADD, (event, connectionDetails) => {
    store.add(connectionDetails);

    updateGlobalStoreWebSocketConnections();

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

    updateGlobalStoreWebSocketConnections();
  });

  // @TODO => consider if the user subscription is active or not.
  ipcMain.on(ipcEvents.SOCKET_RECONNECT, (event, connectionDetails) => {
    webSocketActions.reconnect(connectionDetails.id);
  });

  // @TODO: setupUserAuthenticationIpcEvents()?
  ipcMain.on(ipcEvents.USER_LOGIN, (event, id) => {
    subscriptionActions.startRefreshInterval(id);
  });

  ipcMain.on(ipcEvents.USER_LOGOUT, () => {
    subscriptionActions.stopRefreshInterval();

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
