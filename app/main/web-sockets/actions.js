import WebSocket from "ws";
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

export const connect = id => {
  const ws = store.find(id);
  if (!ws) return;

  // store.stateIs() does not work here for some reason.
  if (ws.socket && ws.socket.readyState !== 3) return;

  const webSocketUri = getWebSocketUri(ws.searchUrl);

  javaScriptUtils.devLog(`Connect initiated - ${webSocketUri} / ${id}`);

  ws.socket = new WebSocket(webSocketUri, {
    headers: {
      Cookie: poeTrade.getCookies(),
    },
  });

  ws.socket.on("open", () => {
    javaScriptUtils.devLog(`SOCKET OPEN - ${webSocketUri} / ${ws.id}`);

    heartbeat(ws.socket);

    updateSocket(ws.id, {
      ...ws,
    });

    setupMessageListener(id);
  });

  ws.socket.on("ping", () => {
    javaScriptUtils.devLog(`SOCKET PING - ${webSocketUri} / ${ws.id}`);

    heartbeat(ws.socket);
  });

  ws.socket.on("error", error => {
    javaScriptUtils.devLog(
      `SOCKET ERROR - ${webSocketUri} / ${ws.id} ${error}`
    );

    updateSocket(ws.id, {
      ...ws,
    });

    ws.socket.close();
  });

  ws.socket.on("close", (code, reason) => {
    javaScriptUtils.devLog(
      `SOCKET CLOSE - ${webSocketUri} / ${ws.id} ${code} ${reason}`
    );

    updateSocket(ws.id, {
      ...ws,
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
