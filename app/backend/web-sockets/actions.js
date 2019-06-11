import { Notification } from "electron";
import WebSocket from "ws";
import getWindowByName from "../utils/get-window-by-name/get-window-by-name";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";
import store from "./store";
import subscription from "../../Subscription/Subscription";
import { storeKeys } from "../../resources/StoreKeys/StoreKeys";
import { globalStore } from "../../GlobalStore/GlobalStore";

const doNotify = ({ notificationMessage }) => {
  new Notification({
    title: "PoE Sniper Pro",
    body: notificationMessage
  }).show();
};

const setupWebSocketListeners = webSocket => {
  webSocket.on("message", message => {
    /* doNotify({
      notificationMessage: message
    }); */

    const window = getWindowByName("PoE Sniper");

    window.webContents.send(ipcEvents.TRADE_MESSAGE, message);
  });
};

export const connect = id => {
  const ws = store.find(id);

  const poeSessionId = globalStore.get(storeKeys.POE_SESSION_ID, "");

  if (!ws.isConnected) {
    const newWebsocket = new WebSocket(ws.uri, {
      headers: {
        Cookie: `POESESSID=${poeSessionId}`
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
