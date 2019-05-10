import { BrowserWindow } from "electron";

const getWindowByName = name => {
  const allWindows = BrowserWindow.getAllWindows();

  return allWindows.find(window => window.getTitle() === name);
};

export default getWindowByName;
