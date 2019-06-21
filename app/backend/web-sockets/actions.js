import WebSocket from "ws";
import { clipboard } from "electron";
import store from "./store";
import notificationsLimiter from "../notifications-limiter/notifications-limiter";
import subscription from "../../Subscription/Subscription";
import * as poeTrade from "../poe-trade/poe-trade";
import * as javaScriptUtils from "../../utils/JavaScriptUtils/JavaScriptUtils";

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

            limiter.schedule(() => {
              const whisperMessage = poeTrade.getWhisperMessage(itemDetails);

              clipboard.writeText(whisperMessage);

              poeTrade.notifyUser(ws.name, whisperMessage);
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

export const connect = id => {
  const ws = store.find(id);

  if (!ws.isConnected) {
    const newWebsocket = new WebSocket(ws.uri, {
      headers: {
        Cookie: poeTrade.getCookies()
      }
    });

    store.update(ws.id, {
      ...ws,
      socket: newWebsocket,
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
