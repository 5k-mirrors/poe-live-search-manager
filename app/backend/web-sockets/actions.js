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

const copyWhisperIsEnabled = () => {
  const copyWhisper = globalStore.get(storeKeys.COPY_WHISPER, true);

  return copyWhisper;
};

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

                if (copyWhisperIsEnabled()) {
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
    ...details
  });

  const window = electronUtils.getWindowByName("PoE Sniper");

  window.webContents.send(ipcEvents.SOCKET_STATE_UPDATE, {
    id,
    isConnected: details.isConnected
  });
};

export const connect = id => {
  const ws = store.find(id);

  if (!ws.isConnected) {
    const webSocketUri = getWebSocketUri(ws.searchUrl);

    const newWebsocket = new WebSocket(webSocketUri, {
      headers: {
        Cookie: poeTrade.getCookies()
      }
    });

    newWebsocket.on("open", () => {
      updateSocket(ws.id, {
        ...ws,
        socket: newWebsocket,
        isConnected: true
      });

      setupMessageListener(id);
    });

    newWebsocket.on("error", error => {
      // eslint-disable-next-line no-console
      console.error(JSON.stringify(error));

      updateSocket(ws.id, {
        ...ws,
        isConnected: false
      });
    });

    newWebsocket.on("close", (code, reason) => {
      // eslint-disable-next-line no-console
      console.error(`${ws.id} connection is closed. ${code}, ${reason}`);

      updateSocket(ws.id, {
        ...ws,
        isConnected: false
      });
    });
  }
};

export const disconnect = id => {
  const ws = store.find(id);

  if (ws.isConnected) {
    ws.socket.close();

    delete ws.socket;
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
