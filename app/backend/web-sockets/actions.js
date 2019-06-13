import WebSocket from "ws";
import store from "./store";
import subscription from "../../Subscription/Subscription";
import * as poeTrade from "../poe-trade/poe-trade";
import ItemFetchError from "../errors/item-fetch-error";

const setupWebSocketListeners = webSocket => {
  webSocket.on("message", itemIds => {
    const parsedItemIds = JSON.parse(itemIds);

    parsedItemIds.new.forEach(id => {
      poeTrade
        .fetchItemDetails(id)
        .then(itemDetails => {
          poeTrade.copyWhisperToClipboard(itemDetails);
        })
        .catch(err => {
          if (err instanceof ItemFetchError) {
            // eslint-disable-next-line no-console
            console.error(err);
          }
        });
    });
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
      setupWebSocketListeners(newWebsocket);
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
