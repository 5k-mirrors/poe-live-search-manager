import { ipcMain } from "electron";
import { globalStore } from "../../GlobalStore/GlobalStore";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";
import { storeKeys } from "../../resources/StoreKeys/StoreKeys";
import socketStates from "../../resources/SocketStates/SocketStates";
import * as storeUtils from "../../utils/StoreUtils/StoreUtils";
import * as electronUtils from "../utils/electron-utils/electron-utils";
import * as webSocketActions from "../web-sockets/actions";
import * as subscriptionActions from "../../Subscription/Actions";
import store from "../web-sockets/store";
import subscription from "../../Subscription/Subscription";
import limiterGroup from "../limiter-group/limiter-group";
import requestLimiter from "../request-limiter/request-limiter";
import stateIs from "../utils/state-is/state-is";

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
    store.add(connectionDetails);

    globalStore.set(storeKeys.WS_CONNECTIONS, store.sanitized());

    webSocketActions.updateConnections();
  });

  ipcMain.on(ipcEvents.WS_REMOVE, (event, connectionDetails) => {
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
  ipcMain.on(ipcEvents.USER_LOGIN, (event, id) => {
    subscriptionActions.startRefreshInterval(id);
  });

  ipcMain.on(ipcEvents.USER_LOGOUT, () => {
    subscriptionActions.stopRefreshInterval();

    webSocketActions.disconnectAll();

    storeUtils.clear(storeKeys.POE_SESSION_ID);
  });
};

const setupGeneralIpcListeners = () => {
  ipcMain.on(ipcEvents.TEST_NOTIFICATION, () => {
    electronUtils.doNotify({
      title: "Title",
      body: "Description",
    });
  });

  ipcMain.on(
    ipcEvents.SUBSCRIPTION_UPDATE,
    (event, updatedSubscriptionData) => {
      if (subscription.active() !== updatedSubscriptionData.paying) {
        subscription.update(updatedSubscriptionData);

        webSocketActions.updateConnections();
      }
    }
  );

  ipcMain.on(ipcEvents.GET_PAYING_STATUS, event => {
    event.sender.send(ipcEvents.SEND_PAYING_STATUS, subscription.active());
  });

  ipcMain.on(ipcEvents.DROP_SCHEDULED_RESULTS, () => {
    limiterGroup.drop();
  });
};

export default () =>
  requestLimiter.initialize().then(() =>
    // The reservoir's value must be decremented by one because the initialization contains a fetch which already counts towards the rate limit.
    requestLimiter.bottleneckInstance.incrementReservoir(-1).then(() => {
      store.load();

      setupStoreIpcListeners();

      setupWebSocketIpcListeners();

      setupAuthenticationIpcListeners();

      setupGeneralIpcListeners();
    })
  );
