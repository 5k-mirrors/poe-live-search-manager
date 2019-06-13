import WebSocket from "ws";
import { clipboard } from "electron";
import store from "./store";
import subscription from "../../Subscription/Subscription";
import * as poeTrade from "../poe-trade/poe-trade";
import * as javaScriptUtils from "../../utils/JavaScriptUtils/JavaScriptUtils";

const setupMessageListener = id => {
  const ws = store.find(id);

  ws.socket.on("message", response => {
    const parsedResponse = JSON.parse(response);

    const itemIds = javaScriptUtils.safeAccess(["new"], parsedResponse);

    if (javaScriptUtils.isDefined(itemIds)) {
      itemIds.forEach(itemId => {
        poeTrade.getResult(itemId).then(result => {
          const whisperMessage = poeTrade.getWhisperMessage(result);

          clipboard.writeText(whisperMessage);

          poeTrade.notifyUser(whisperMessage, ws.name);
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
