import { Notification } from "electron";
import getCurrentWindow from "../GetCurrentWindow/GetCurrentWindow";
import { ipcEvents } from "../../../resources/IPCEvents/IPCEvents";

// TODO: shouldn't be stored within the `utils` folder.

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

    const currentWindow = getCurrentWindow();

    currentWindow.webContents.send(ipcEvents.ON_MESSAGE, message);
  });
};

export default setupWebSocketListeners;
