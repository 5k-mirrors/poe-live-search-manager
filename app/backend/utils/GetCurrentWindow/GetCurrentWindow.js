import { BrowserWindow } from "electron";

const getCurrentWindow = () => {
  const allWindows = BrowserWindow.getAllWindows();

  return allWindows[0];
};

export default getCurrentWindow;
