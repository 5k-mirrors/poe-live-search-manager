import { Notification } from "electron";
import WebSocket from "ws";
import getWindowByName from "../utils/get-window-by-name/get-window-by-name";
import * as JavaScriptUtils from "../../utils/JavaScriptUtils/JavaScriptUtils";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";
import store from "./store";

const doNotify = ({ notificationMessage }) => {
  new Notification({
    title: "PoE Sniper Pro",
    body: notificationMessage
  }).show();
};

const setupWebSocketListeners = webSocket => {
  webSocket.on("message", message => {
    doNotify({
      notificationMessage: message
    });

    const window = getWindowByName("PoE Sniper");

    window.webContents.send(ipcEvents.TRADE_MESSAGE, message);
  });
};

export const connect = id => {
  const ws = store.get(id);

  const newWebsocket = new WebSocket(ws.uri);

  newWebsocket.on("open", () => {
    store.update(ws.id, {
      socket: newWebsocket
    });

    setupWebSocketListeners(newWebsocket);
  });
};

export const disconnect = id => {
  const ws = store.get(id);

  if (JavaScriptUtils.isDefined(ws.socket)) {
    ws.socket.close();
  }
};
