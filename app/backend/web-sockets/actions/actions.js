import { Notification } from "electron";
import WebSocket from "ws";
import getWindowByName from "../../utils/get-window-by-name/get-window-by-name";
import * as JavaScriptUtils from "../../../utils/JavaScriptUtils/JavaScriptUtils";
import { storedWebSockets } from "../../../StoredWebSockets/StoredWebSockets";
import { ipcEvents } from "../../../resources/IPCEvents/IPCEvents";

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

export const connectToWebSocket = connectionDetails => {
  const newWebSocket = new WebSocket(connectionDetails.uri);

  newWebSocket.on("open", () => {
    storedWebSockets.updateWithSocket(connectionDetails.id, newWebSocket);

    setupWebSocketListeners(newWebSocket);
  });
};

export const removeWebSocket = id => {
  const ws = storedWebSockets.get(id);

  storedWebSockets.remove(ws.id);

  if (JavaScriptUtils.isDefined(ws.socket)) {
    ws.socket.close();
  }
};
