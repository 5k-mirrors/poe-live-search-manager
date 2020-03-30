import { ipcMain } from "electron";
import GlobalStore from "../../GlobalStore/GlobalStore";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";
import { storeKeys } from "../../resources/StoreKeys/StoreKeys";
import socketStates from "../../resources/SocketStates/SocketStates";
import * as storeUtils from "../../utils/StoreUtils/StoreUtils";
import * as electronUtils from "../utils/electron-utils/electron-utils";
import * as webSocketActions from "../web-sockets/actions";
import * as subscriptionActions from "../../Subscription/Actions";
import Store from "../web-sockets/store";
import Subscription from "../../Subscription/Subscription";
import HttpRequestLimiter from "../http-request-limiter/http-request-limiter";
import NotificationsLimiter from "../notification-limiter/notification-limiter";
import stateIs from "../utils/state-is/state-is";
import { windows } from "../../resources/Windows/Windows";
import User from "../user/user";
import authenticatedFetch from "../utils/authenticated-fetch/authenticated-fetch";
import { devErrorLog } from "../../utils/JavaScriptUtils/JavaScriptUtils";
import retry from "../../utils/Retry/Retry";

const setupStoreIpcListeners = () => {
  ipcMain.on(ipcEvents.GET_SOCKETS, event => {
    const storeWithStates = Store.sockets.map(
      ({ socket, ...remainingSocketDetails }) => ({
        ...remainingSocketDetails,
        isConnected: socket && stateIs(socket, socketStates.OPEN),
      })
    );

    event.sender.send(ipcEvents.SEND_SOCKETS, storeWithStates);
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
  ipcMain.on(
    ipcEvents.USER_LOGIN,
    async (event, userId, idToken, privacyPolicyLink, privacyPolicyVersion) => {
      const globalStore = GlobalStore.getInstance();

      globalStore.set(storeKeys.IS_LOGGED_IN, true);
      globalStore.set(storeKeys.ACCEPTED_PRIVACY_POLICY, {
        link: privacyPolicyLink,
        version: privacyPolicyVersion,
      });

      User.update({
        id: userId,
        jwt: idToken,
      });

      subscriptionActions.startRefreshInterval();

      try {
        await retry(async () => {
          const res = await authenticatedFetch(
            `${process.env.FIREBASE_API_URL}/user/${User.data.id}/privacy-policy`,
            {
              method: "PATCH",
              body: JSON.stringify({
                link: privacyPolicyLink,
                version: privacyPolicyVersion,
              }),
            },
            { "Content-Type": "application/json" }
          );

          if (!res.ok) {
            throw new Error(`HTTP error: ${res.status} - ${res.statusText}`);
          }
        });
      } catch (err) {
        devErrorLog("Error while updating privacy policy.", err);

        event.sender.send(ipcEvents.PRIVACY_POLICY_UPDATE_FAIL);
      }
    }
  );

  ipcMain.on(ipcEvents.USER_LOGOUT, () => {
    const globalStore = GlobalStore.getInstance();

    subscriptionActions.stopRefreshInterval();

    webSocketActions.disconnectAll();

    globalStore.set(storeKeys.IS_LOGGED_IN, false);
    User.clear();
    storeUtils.clear(storeKeys.POE_SESSION_ID);
    storeUtils.clear(storeKeys.ACCEPTED_PRIVACY_POLICY);
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
