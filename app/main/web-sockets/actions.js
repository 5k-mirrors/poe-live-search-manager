import WebSocket from "ws";
import store from "./store";
import subscription from "../../Subscription/Subscription";
import processItems from "../process-items/process-items";
import * as poeTrade from "../poe-trade/poe-trade";
import * as javaScriptUtils from "../../utils/JavaScriptUtils/JavaScriptUtils";
import * as electronUtils from "../utils/electron-utils/electron-utils";
import getWebSocketUri from "../get-websocket-uri/get-websocket-uri";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";
import { globalStore } from "../../GlobalStore/GlobalStore";
import { storeKeys } from "../../resources/StoreKeys/StoreKeys";
import { windows } from "../../resources/Windows/Windows";
import mutex from "../mutex/mutex";

const updateSocket = (id, details) => {
  store.update(id, {
    ...details,
  });

  electronUtils.send(windows.POE_SNIPER, ipcEvents.SOCKET_STATE_UPDATE, {
    id,
    isConnected: store.stateIs(details.socket, 1),
  });
};

const serverPingTimeframeSeconds = 30;
const pingAllowedDelaySeconds = 1;

const heartbeat = socket => {
  clearTimeout(socket.pingTimeout);

  // Timeouts need to be defined per WebSocket
  // eslint-disable-next-line no-param-reassign
  socket.pingTimeout = setTimeout(() => {
    socket.terminate();
  }, (serverPingTimeframeSeconds + pingAllowedDelaySeconds) * 1000);
};

const setupListeners = id => {
  const ws = store.find(id);

  ws.socket.on("open", () => {
    javaScriptUtils.devLog(`SOCKET OPEN - ${ws.searchUrl} / ${ws.id}`);

    heartbeat(ws.socket);

    updateSocket(ws.id, {
      ...ws,
    });
  });

  ws.socket.on("message", response => {
    const parsedResponse = JSON.parse(response);

    const itemIds = javaScriptUtils.safeGet(parsedResponse, ["new"]);

    if (javaScriptUtils.isDefined(itemIds)) {
      processItems(itemIds, ws);
    }
  });

  ws.socket.on("ping", () => {
    javaScriptUtils.devLog(`SOCKET PING - ${ws.searchUrl} / ${ws.id}`);

    heartbeat(ws.socket);
  });

  ws.socket.on("error", error => {
    javaScriptUtils.devLog(
      `SOCKET ERROR - ${ws.searchUrl} / ${ws.id} ${error}`
    );

    updateSocket(ws.id, {
      ...ws,
    });

    ws.socket.close();
  });

  ws.socket.on("close", (code, reason) => {
    javaScriptUtils.devLog(
      `SOCKET CLOSE - ${ws.searchUrl} / ${ws.id} ${code} ${reason}`
    );

    updateSocket(ws.id, {
      ...ws,
    });

    const isLoggedIn = globalStore.get(storeKeys.IS_LOGGED_IN, false);

    if (isLoggedIn && subscription.active()) {
      setTimeout(() => {
        javaScriptUtils.devLog(
          `Auto-reconnect initiated - ${ws.searchUrl} / ${ws.id}`
        );
        connect(ws.id);
      }, 500);
    }
  });
};

export const connect = async id => {
  return mutex.acquire().then(release => {
    const ws = store.find(id);

    if (!ws) return release();

    if (ws.socket && ws.socket.readyState !== 3) return release();

    const webSocketUri = getWebSocketUri(ws.searchUrl);

    javaScriptUtils.devLog(`Connect initiated - ${webSocketUri} / ${ws.id}`);

    const socket = new WebSocket(webSocketUri, {
      headers: {
        Cookie: poeTrade.getCookies(),
      },
    });

    store.update(ws.id, {
      ...ws,
      socket,
    });

    setupListeners(ws.id);

    return release();
  });
};

export const disconnect = id => {
  const ws = store.find(id);
  if (!ws) return;

  javaScriptUtils.devLog(`Disconnect initiated - ${id}`);

  if (store.stateIs(ws.socket, 1)) {
    ws.socket.close();

    updateSocket(ws.id, {
      ...ws,
    });
  }
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
