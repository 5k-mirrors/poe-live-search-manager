import WebSocket from "ws";
import { Mutex } from "async-mutex";
import store from "./store";
import subscription from "../../Subscription/Subscription";
import * as poeTrade from "../poe-trade/poe-trade";
import * as javaScriptUtils from "../../utils/JavaScriptUtils/JavaScriptUtils";
import * as electronUtils from "../utils/electron-utils/electron-utils";
import getWebSocketUri from "../get-websocket-uri/get-websocket-uri";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";
import { globalStore } from "../../GlobalStore/GlobalStore";
import { storeKeys } from "../../resources/StoreKeys/StoreKeys";
import { windows } from "../../resources/Windows/Windows";
import processItems from "../process-items/process-items";

const setupMessageListener = id => {
  const ws = store.find(id);
  if (!ws) return;

  ws.socket.on("message", response => {
    const parsedResponse = JSON.parse(response);

    const itemIds = javaScriptUtils.safeGet(parsedResponse, ["new"]);

    if (javaScriptUtils.isDefined(itemIds)) {
      processItems(itemIds, ws);
    }
  });
};

const updateSocket = (id, details) => {
  store.update(id, {
    ...details,
  });

  /* electronUtils.send(windows.POE_SNIPER, ipcEvents.SOCKET_STATE_UPDATE, {
    id,
    isConnected: details.isConnected,
  }); */

  electronUtils.send(windows.POE_SNIPER, ipcEvents.SOCKET_STATE_UPDATE, {
    id,
    isConnected: store.open(id),
  });
};

const serverPingTimeframeSeconds = 30;
const pingAllowedDelaySeconds = 1;

const heartbeat = ws => {
  clearTimeout(ws.pingTimeout);

  // Timeouts need to be defined per WebSocket
  // eslint-disable-next-line no-param-reassign
  ws.pingTimeout = setTimeout(() => {
    ws.terminate();
  }, (serverPingTimeframeSeconds + pingAllowedDelaySeconds) * 1000);
};

const mutex = new Mutex();

const setupListeners = ws => {
  ws.socket.on("open", () => {
    javaScriptUtils.devLog(`SOCKET OPEN - ${ws.webSocketUri} / ${ws.id}`);

    heartbeat(ws.socket);

    setupMessageListener(ws.id);
  });

  ws.socket.on("ping", () => {
    javaScriptUtils.devLog(`SOCKET PING - ${ws.webSocketUri} / ${ws.id}`);

    heartbeat(ws.socket);
  });

  ws.socket.on("error", error => {
    javaScriptUtils.devLog(
      `SOCKET ERROR - ${ws.webSocketUri} / ${ws.id} ${error}`
    );

    ws.socket.close();
  });

  ws.socket.on("close", (code, reason) => {
    javaScriptUtils.devLog(
      `SOCKET CLOSE - ${ws.webSocketUri} / ${ws.id} ${code} ${reason}`
    );

    const isLoggedIn = globalStore.get(storeKeys.IS_LOGGED_IN, false);

    if (isLoggedIn && subscription.active()) {
      setTimeout(() => {
        javaScriptUtils.devLog(
          `Auto-reconnect initiated - ${ws.webSocketUri} / ${ws.id}`
        );
        connect(ws.id);
      }, 500);
    }
  });
};

const create = id => {
  const ws = store.find(id);

  // When the socket is not defined.
  if (!ws) {
    // return release();
    return;
  }

  // So when the socket exists and it's not in CLOSED state.
  // But what if it's in CLOSING state?
  /* if (ws.socket && ws.socket.readyState !== 3) {
    return release();
  } */

  if (!store.closed(ws.id)) {
    // return release();
    return;
  }

  const webSocketUri = getWebSocketUri(ws.searchUrl);

  javaScriptUtils.devLog(`Connect initiated - ${webSocketUri} / ${id}`);

  ws.socket = new WebSocket(webSocketUri, {
    headers: {
      Cookie: poeTrade.getCookies(),
    },
  });

  updateSocket(ws.id, {
    ...ws,
    webSocketUri,
  });

  setupListeners(ws);

  // return release();
};

export const connect = id => {
  mutex.acquire().then(release => {
    create(id);

    release();
  });

  /* const ws = store.find(id);
  if (!ws) return;
  if (ws.isConnected) return;

  const webSocketUri = getWebSocketUri(ws.searchUrl);

  javaScriptUtils.devLog(`Connect initiated - ${webSocketUri} / ${id}`);

  const newWebsocket = new WebSocket(webSocketUri, {
    headers: {
      Cookie: poeTrade.getCookies(),
    },
  });

  newWebsocket.on("open", () => {
    javaScriptUtils.devLog(`SOCKET OPEN - ${webSocketUri} / ${ws.id}`);

    heartbeat(newWebsocket);

    updateSocket(ws.id, {
      ...ws,
      socket: newWebsocket,
      isConnected: true,
    });

    setupMessageListener(id);
  });

  newWebsocket.on("ping", () => {
    javaScriptUtils.devLog(`SOCKET PING - ${webSocketUri} / ${ws.id}`);

    heartbeat(newWebsocket);
  });

  newWebsocket.on("error", error => {
    javaScriptUtils.devLog(
      `SOCKET ERROR - ${webSocketUri} / ${ws.id} ${error}`
    );

    updateSocket(ws.id, {
      ...ws,
      isConnected: false,
    });

    newWebsocket.close();
  });

  newWebsocket.on("close", (code, reason) => {
    javaScriptUtils.devLog(
      `SOCKET CLOSE - ${webSocketUri} / ${ws.id} ${code} ${reason}`
    );

    updateSocket(ws.id, {
      ...ws,
      isConnected: false,
    });

    const isLoggedIn = globalStore.get(storeKeys.IS_LOGGED_IN, false);

    if (isLoggedIn && subscription.active()) {
      setTimeout(() => {
        javaScriptUtils.devLog(
          `Auto-reconnect initiated - ${webSocketUri} / ${id}`
        );
        connect(id);
      }, 500);
    }
  }); */
};

export const disconnect = id => {
  const ws = store.find(id);
  if (!ws) return;

  javaScriptUtils.devLog(`Disconnect initiated - ${id}`);

  if (!store.closed(id)) {
    ws.socket.close();

    updateSocket(ws.id, {
      ...ws,
    });
  }

  /* if (ws.isConnected && ws.socket) {
    ws.socket.close();

    delete ws.socket;

    updateSocket(ws.id, {
      ...ws,
      isConnected: false,
    });
  } */
};

const connectAll = () => {
  store.all().forEach(connectionDetails => {
    connect(connectionDetails.id);
  });
};

export const disconnectAll = () => {
  store.all().forEach(connectionDetails => {
    disconnect(connectionDetails.id);
  });
};

export const updateConnections = () => {
  const isLoggedIn = globalStore.get(storeKeys.IS_LOGGED_IN, false);
  const poeSessionId = globalStore.get(storeKeys.POE_SESSION_ID);

  const conditionsAreFulfilled =
    isLoggedIn && poeSessionId && subscription.active();

  if (conditionsAreFulfilled) {
    return connectAll();
  }

  return disconnectAll();
};

export const reconnect = id => {
  disconnect(id);
};

export const reconnectAll = () => {
  disconnectAll();
};
