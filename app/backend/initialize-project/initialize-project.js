import { ipcMain } from "electron";
import { globalStore } from "../../GlobalStore/GlobalStore";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";
import { storeKeys } from "../../resources/StoreKeys/StoreKeys";
import * as storeUtils from "../../utils/StoreUtils/StoreUtils";
import * as webSocketActions from "../web-sockets/actions";
import store from "../web-sockets/store";
import * as subscriptionActions from "../../Subscription/Actions";
// import subscription from "../../Subscription/Subscription";

/* const connectToStoredWebSockets = () => {
  store.all().forEach(connectionDetails => {
    webSocketActions.connect(connectionDetails.id);
  });
};

const disconnectFromStoredWebSockets = () => {
  store.all().forEach(connectionDetails => {
    webSocketActions.disconnect(connectionDetails.id);
  });
}; */

/* let subscriptionIntervalTimer;

const startSubscriptionInterval = id => {
  const oneHourInMilliseconds = 3600000;

  subscriptionIntervalTimer = setInterval(() => {
    return subscription.getData(id).then(subscriptionData => {
      subscription.update(subscriptionData);

      if (subscription.active()) {
        return connectToStoredWebSockets();
      }

      return disconnectFromStoredWebSockets();
    });
  }, oneHourInMilliseconds);
}; */

const setupIpcEvents = () => {
  ipcMain.on(ipcEvents.WS_ADD, (event, connectionDetails) => {
    store.add(connectionDetails);

    const isLoggedIn = globalStore.get(storeKeys.IS_LOGGED_IN, false);

    if (isLoggedIn) {
      subscriptionActions.checkIfSubscriptionIsActive();
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
    subscriptionActions.startSubscriptionInterval(id);
  });

  ipcMain.on(ipcEvents.USER_LOGOUT, () => {
    subscriptionActions.clearSubscriptionInterval();

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
