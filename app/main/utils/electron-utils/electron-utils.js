import { Notification, BrowserWindow } from "electron";

export const doNotify = ({ title, body }) => {
  new Notification({
    title,
    body,
  }).show();
};

export const getWindowByName = name => {
  const allWindows = BrowserWindow.getAllWindows();

  return allWindows.find(window => window.getTitle() === name);
};

export const send = (windowName, event, payload) => {
  const window = getWindowByName(windowName);

  window.webContents.send(event, payload);
};
