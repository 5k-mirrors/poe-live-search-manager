import { BrowserWindow, Notification } from "electron";
import { ipcEvents } from "../../../resources/IPCEvents/IPCEvents";

const doNotify = ({ notificationMessage }) => {
  new Notification({
    title: "PoE Sniper Pro",
    body: notificationMessage
  }).show();
};

const getCurrentWindow = () => {
  const allWindows = BrowserWindow.getAllWindows();

  return allWindows[0];
};

const setupWebSocketListeners = webSocket => {
  webSocket.on("message", message => {
    doNotify({
      notificationMessage: message
    });

    const currentWindow = getCurrentWindow();

    currentWindow.webContents.send(ipcEvents.ON_MESSAGE, "test");
  });
};

export default setupWebSocketListeners;
