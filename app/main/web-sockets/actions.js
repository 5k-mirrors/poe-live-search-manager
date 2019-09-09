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

const setupMessageListener = id => {
  const limiter = notificationsLimiter.getLimiter();

  const ws = store.find(id);

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

  if (!ws.isConnected) {
    const webSocketUri = getWebSocketUri(ws.searchUrl);

    const newWebsocket = new WebSocket(webSocketUri, {
      headers: {
        Cookie: poeTrade.getCookies(),
      },
    });

    newWebsocket.on("open", () => {
      javaScriptUtils.devLog(`SOCKET OPEN - ${ws.id}`);

      heartbeat(newWebsocket);

      updateSocket(ws.id, {
        ...ws,
        socket: newWebsocket,
        isConnected: true,
      });

      setupMessageListener(id);
    });

    newWebsocket.on("ping", () => {
      javaScriptUtils.devLog(`SOCKET PING - ${ws.id}`);

      heartbeat(newWebsocket);
    });

    newWebsocket.on("error", error => {
      javaScriptUtils.devLog(`SOCKET ERROR - ${ws.id} ${error}`);

      updateSocket(ws.id, {
        ...ws,
        isConnected: false,
      });

      newWebsocket.close();
    });

    newWebsocket.on("close", (code, reason) => {
      javaScriptUtils.devLog(`SOCKET CLOSE - ${ws.id} ${code} ${reason}`);

      updateSocket(ws.id, {
        ...ws,
        isConnected: false,
      });

      if (subscription.active()) {
        setTimeout(() => {
          connect(id);
        }, 500);
      }
    });
  }
};

export const disconnect = id => {
  const ws = store.find(id);

  if (ws.isConnected && ws.socket) {
    ws.socket.close();

    delete ws.socket;

    updateSocket(ws.id, {
      ...ws,
      isConnected: false,
    });
  }
};

export const connectToStoredWebSockets = () => {
  store.all().forEach(connectionDetails => {
    connect(connectionDetails.id);
  });
};

export const disconnectFromStoredWebSockets = () => {
  store.all().forEach(connectionDetails => {
    disconnect(connectionDetails.id);
  });
};

export const updateConnections = () => {
  if (subscription.active()) {
    connectToStoredWebSockets();
  } else {
    disconnectFromStoredWebSockets();
  }
};

export const reconnect = id => {
  disconnect(id);

  if (subscription.active()) {
    // Reconnect delayed so that there's feedback to the user. Otherwise, it might be too quick.
    setTimeout(() => connect(id), 500);
  }
};

export const reconnectAll = () => {
  disconnectFromStoredWebSockets();

  if (subscription.active()) {
    // Reconnect delayed so that there's feedback to the user. Otherwise, it might be too quick.
    setTimeout(() => connectToStoredWebSockets(), 500);
  }
};
