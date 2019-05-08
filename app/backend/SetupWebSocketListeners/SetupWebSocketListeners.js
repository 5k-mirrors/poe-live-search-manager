import { Notification } from "electron";
import getMainWindow from "../utils/GetMainWindow/GetMainWindow";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";

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

    const mainWindow = getMainWindow();

    mainWindow.webContents.send(ipcEvents.MESSAGE, message);
  });
};

export default setupWebSocketListeners;
