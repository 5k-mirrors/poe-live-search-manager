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

                clipboard.writeText(whisperMessage);

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

const sendSocketStateUpdate = updatedSocketData => {
  const window = electronUtils.getWindowByName("PoE Sniper");

  window.webContents.send(ipcEvents.SOCKET_STATE_UPDATE, updatedSocketData);
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

    store.update(ws.id, {
      ...ws,
      socket: newWebsocket,
      isConnected: true
    });

    sendSocketStateUpdate({
      id: ws.id,
      isConnected: true
    });

    newWebsocket.on("open", () => {
      setupMessageListener(id);
    });
  }
};

export const disconnect = id => {
  const ws = store.find(id);

  if (ws.isConnected) {
    ws.socket.close();

    delete ws.socket;

    store.update(ws.id, {
      ...ws,
      isConnected: false
    });

    sendSocketStateUpdate({
      id: ws.id,
      isConnected: false
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

  connect(id);
};
