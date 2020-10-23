import { ipcMain } from "electron";
import GlobalStore from "../../shared/GlobalStore/GlobalStore";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";
import { storeKeys } from "../../resources/StoreKeys/StoreKeys";
import socketStates from "../web-sockets/socket-states";
import * as storeUtils from "../../utils/StoreUtils/StoreUtils";
import * as electronUtils from "../utils/electron-utils/electron-utils";
import * as webSocketActions from "../web-sockets/actions";
import * as subscriptionActions from "../../shared/Subscription/Actions";
import Store from "../web-sockets/store";
import Subscription from "../../shared/Subscription/Subscription";
import HttpRequestLimiter from "../http-request-limiter/http-request-limiter";
import NotificationsLimiter from "../notification-limiter/notification-limiter";
import stateIs from "../utils/state-is/state-is";
import { windows } from "../../resources/Windows/Windows";
import User from "../user/user";

const setupStoreIpcListeners = () => {
  ipcMain.handle(ipcEvents.GET_SOCKETS, () => {
    return Store.sockets.map(({ socket, ...remainingSocketDetails }) => ({
      ...remainingSocketDetails,
      isConnected: socket && stateIs(socket, socketStates.OPEN),
    }));
  });
};

const setupWebSocketIpcListeners = () => {
  ipcMain.on(ipcEvents.WS_ADD, (event, connectionDetails) => {
    const globalStore = GlobalStore.getInstance();

    Store.add(connectionDetails);

    globalStore.set(storeKeys.WS_CONNECTIONS, Store.sanitized());

    webSocketActions.updateConnections();
  });

  ipcMain.on(ipcEvents.WS_REMOVE, (event, connectionDetails) => {
    const globalStore = GlobalStore.getInstance();

    webSocketActions.disconnect(connectionDetails.id);

    Store.remove(connectionDetails.id);

    globalStore.set(storeKeys.WS_CONNECTIONS, Store.sanitized());
  });

  ipcMain.on(ipcEvents.RECONNECT_SOCKET, (event, connectionDetails) => {
    webSocketActions.reconnect(connectionDetails.id);
  });

  ipcMain.on(ipcEvents.RECONNECT_ALL, () => {
    webSocketActions.reconnectAll();
  });
};

const setupAuthenticationIpcListeners = () => {
  ipcMain.on(ipcEvents.USER_LOGIN, (_, userId, idToken) => {
    const globalStore = GlobalStore.getInstance();

    globalStore.set(storeKeys.IS_LOGGED_IN, true);

    User.update({
      id: userId,
      jwt: idToken,
    });

    // A small delay is needed for:
    // - Firebase triggers to create the user object upon registration
    // - the renderer process to be ready to receive messages upon app start
    setTimeout(() => {
      subscriptionActions.startRefreshInterval();
    }, 2000);
  });

  ipcMain.on(ipcEvents.USER_LOGOUT, () => {
    const globalStore = GlobalStore.getInstance();

    subscriptionActions.stopRefreshInterval();

    webSocketActions.disconnectAll();

    globalStore.set(storeKeys.IS_LOGGED_IN, false);
    User.clear();
    storeUtils.clear(storeKeys.POE_SESSION_ID);
    Subscription.clear();

    electronUtils.send(windows.MAIN, ipcEvents.UPDATE_SUBSCRIPTION_DETAILS, {
      data: Subscription.data,
    });
  });

  ipcMain.on(ipcEvents.ID_TOKEN_CHANGED, (_, idToken) => {
    User.update({
      jwt: idToken,
    });
  });
};

const setupGeneralIpcListeners = () => {
  ipcMain.on(ipcEvents.TEST_NOTIFICATION, () => {
    electronUtils.doNotify({
      title: "Title",
      body: "Description",
    });
  });

  ipcMain.handle(ipcEvents.FETCH_SUBSCRIPTION_DETAILS, () => {
    return subscriptionActions
      .refresh()
      .then(subscriptionData => {
        return {
          data: { ...subscriptionData },
        };
      })
      .catch(() => {
        return { isErr: true };
      });
  });

  ipcMain.on(ipcEvents.DROP_SCHEDULED_RESULTS, () => {
    NotificationsLimiter.drop();
  });
};

export const initListeners = () => {
  Store.load();

  setupStoreIpcListeners();

  setupWebSocketIpcListeners();

  setupAuthenticationIpcListeners();

  setupGeneralIpcListeners();
};

export const initRateLimiter = () =>
  HttpRequestLimiter.initialize().then(() => {
    // The reservoir's value must be decremented by one because the initialization contains a fetch which already counts towards the rate limit.
    return HttpRequestLimiter.incrementReservoir(-1);
  });
