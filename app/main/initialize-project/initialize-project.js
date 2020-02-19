import { ipcMain } from "electron";
import SingletonGlobalStore from "../../GlobalStore/GlobalStore";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";
import { storeKeys } from "../../resources/StoreKeys/StoreKeys";
import socketStates from "../../resources/SocketStates/SocketStates";
import * as storeUtils from "../../utils/StoreUtils/StoreUtils";
import * as electronUtils from "../utils/electron-utils/electron-utils";
import * as webSocketActions from "../web-sockets/actions";
import * as subscriptionActions from "../../Subscription/Actions";
import store from "../web-sockets/store";
import Subscription from "../../Subscription/Subscription";
import HttpRequestLimiter from "../http-request-limiter/http-request-limiter";
import NotificationsLimiter from "../notification-limiter/notification-limiter";
import stateIs from "../utils/state-is/state-is";
import { windows } from "../../resources/Windows/Windows";
import User from "../user/user";

const setupStoreIpcListeners = () => {
  ipcMain.on(ipcEvents.GET_SOCKETS, event => {
    const storeWithStates = store
      .all()
      .map(({ socket, ...remainingSocketDetails }) => ({
        ...remainingSocketDetails,
        isConnected: socket && stateIs(socket, socketStates.OPEN),
      }));

    event.sender.send(ipcEvents.SEND_SOCKETS, storeWithStates);
  });
};

const setupWebSocketIpcListeners = () => {
  ipcMain.on(ipcEvents.WS_ADD, (event, connectionDetails) => {
    const globalStore = new SingletonGlobalStore();

    store.add(connectionDetails);

    globalStore.set(storeKeys.WS_CONNECTIONS, store.sanitized());

    webSocketActions.updateConnections();
  });

  ipcMain.on(ipcEvents.WS_REMOVE, (event, connectionDetails) => {
    const globalStore = new SingletonGlobalStore();

    webSocketActions.disconnect(connectionDetails.id);

    store.remove(connectionDetails.id);

    globalStore.set(storeKeys.WS_CONNECTIONS, store.sanitized());
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
    const globalStore = new SingletonGlobalStore();

    globalStore.set(storeKeys.IS_LOGGED_IN, true);

    User.update({
      id: userId,
      jwt: idToken,
    });

    subscriptionActions.startRefreshInterval();
  });

  ipcMain.on(ipcEvents.USER_LOGOUT, () => {
    const globalStore = new SingletonGlobalStore();

    subscriptionActions.stopRefreshInterval();

    webSocketActions.disconnectAll();

    globalStore.set(storeKeys.IS_LOGGED_IN, false);
    User.clear();
    storeUtils.clear(storeKeys.POE_SESSION_ID);
    Subscription.clear();

    electronUtils.send(windows.MAIN, ipcEvents.SEND_SUBSCRIPTION_DETAILS, {
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

  ipcMain.on(ipcEvents.GET_SUBSCRIPTION_DETAILS, event => {
    event.sender.send(ipcEvents.SEND_SUBSCRIPTION_DETAILS, {
      data: { ...Subscription.data },
    });
  });

  ipcMain.on(ipcEvents.FETCH_SUBSCRIPTION_DETAILS, () =>
    subscriptionActions.refresh()
  );

  ipcMain.on(ipcEvents.DROP_SCHEDULED_RESULTS, () => {
    NotificationsLimiter.drop();
  });
};

export const initListeners = () => {
  store.load();

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
