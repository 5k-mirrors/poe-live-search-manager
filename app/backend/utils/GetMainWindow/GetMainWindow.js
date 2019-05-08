import { BrowserWindow } from "electron";

const getMainWindow = () => {
  const allWindows = BrowserWindow.getAllWindows();

  return allWindows[0];
};

export default getMainWindow;
