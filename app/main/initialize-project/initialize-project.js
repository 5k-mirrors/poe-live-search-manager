import { ipcMain, dialog, nativeTheme, session } from "electron";
import GlobalStore from "../../shared/GlobalStore/GlobalStore";
import { ipcEvents } from "../../shared/resources/IPCEvents/IPCEvents";
import { storeKeys } from "../../shared/resources/StoreKeys/StoreKeys";
import socketStates from "../web-sockets/socket-states";
import * as electronUtils from "../utils/electron-utils/electron-utils";
import * as webSocketActions from "../web-sockets/actions";
import Store from "../web-sockets/store";
import HttpRequestLimiter from "../http-request-limiter/http-request-limiter";
import NotificationsLimiter from "../notification-limiter/notification-limiter";
import stateIs from "../utils/state-is/state-is";
import { envIs } from "../../shared/utils/JavaScriptUtils/JavaScriptUtils";
import prompt from "electron-prompt";

const setupDialogIpcListeners = () => {
  ipcMain.handle(ipcEvents.MESSAGE_DIALOG, (_event, args) => {
    return dialog.showMessageBox(args);
  });

  ipcMain.handle(ipcEvents.OPEN_DIALOG, (_event, args) => {
    return dialog.showOpenDialog(args);
  });

  ipcMain.handle(ipcEvents.INPUT_DIALOG, (_event, args) => {
    return prompt(args);
  })
};

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

const setupGeneralIpcListeners = () => {
  ipcMain.on(ipcEvents.TEST_NOTIFICATION, () => {
    electronUtils.doNotify({
      title: "Title",
      body: "Description",
    });
  });

  ipcMain.on(ipcEvents.DROP_SCHEDULED_RESULTS, () => {
    NotificationsLimiter.drop();
  });
};

export const ensureEnv = () => {
  if (!process.env.EMAIL) {
    if (envIs("development")) {
      throw new Error(
        "Environment variable missing. Did you fill `.env` file?"
      );
    } else {
      throw new Error(
        "Environment variable missing. Did you fill build environments?"
      );
    }
  }
};

export const initListeners = () => {
  Store.load();

  setupDialogIpcListeners();

  setupStoreIpcListeners();

  setupWebSocketIpcListeners();

  setupGeneralIpcListeners();
};

export const initRateLimiter = () =>
  HttpRequestLimiter.initialize().then(() => {
    // The reservoir's value must be decremented by one because the initialization contains a fetch which already counts towards the rate limit.
    return HttpRequestLimiter.incrementReservoir(-1);
  });

export const setDarkMode = () => {
  const globalStore = GlobalStore.getInstance();

  globalStore.set(storeKeys.DARK_MODE, nativeTheme.shouldUseDarkColors);
}

export const setCSP = () => {
  // Configure CSP headers
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ["script-src 'self' 'unsafe-inline' localhost"]
      }
    })
  });
}
