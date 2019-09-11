import WebSocket from "ws";
import { clipboard } from "electron";
import store from "./store";
import notificationsLimiter from "../notifications-limiter/notifications-limiter";
import { uniqueIdGenerator } from "../../utils/UniqueIdGenerator/UniqueIdGenerator";
import subscription from "../../Subscription/Subscription";
import * as poeTrade from "../poe-trade/poe-trade";
import * as javaScriptUtils from "../../utils/JavaScriptUtils/JavaScriptUtils";
import * as electronUtils from "../utils/electron-utils/electron-utils";
import getWebSocketUri from "../get-websocket-uri/get-websocket-uri";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";
import { globalStore } from "../../GlobalStore/GlobalStore";
import { storeKeys } from "../../resources/StoreKeys/StoreKeys";

const setupMessageListener = id => {
  const limiter = notificationsLimiter.getLimiter();

  const ws = store.find(id);
  if (!ws) return;

  ws.socket.on("message", response => {
    const parsedResponse = JSON.parse(response);

    const itemIds = javaScriptUtils.safeGet(parsedResponse, ["new"]);

    if (javaScriptUtils.isDefined(itemIds)) {
      itemIds.forEach(itemId => {
        poeTrade
          .fetchItemDetails(itemId)
          .then(itemDetails => {
            notificationsLimiter.refreshMinTime();

            limiter
              .schedule({ id: uniqueIdGenerator() }, () => {
                const whisperMessage = poeTrade.getWhisperMessage(itemDetails);

                if (poeTrade.copyWhisperIsEnabled()) {
                  clipboard.writeText(whisperMessage);
                }

                poeTrade.notifyUser(ws.name, whisperMessage);
              })
              .catch(err => {
                // eslint-disable-next-line no-console
                console.error(err);
              });
          })
          .catch(err => {
            // eslint-disable-next-line no-console
            console.error(err);
          });
      });
    }
  });
};

const updateSocket = (id, details) => {
  store.update(id, {
    ...details,
  });

  const window = electronUtils.getWindowByName("PoE Sniper");

  window.webContents.send(ipcEvents.SOCKET_STATE_UPDATE, {
    id,
    isConnected: details.isConnected,
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

export const connect = id => {
  const ws = store.find(id);
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
  });
};

export const disconnect = id => {
  const ws = store.find(id);
  if (!ws) return;

  javaScriptUtils.devLog(`Disconnect initiated - ${id}`);

  if (ws.isConnected && ws.socket) {
    ws.socket.close();

    delete ws.socket;

    updateSocket(ws.id, {
      ...ws,
      isConnected: false,
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
