/* eslint-disable global-require */
import { app, BrowserWindow } from "electron";
import installExtension, {
  REACT_DEVELOPER_TOOLS,
} from "electron-devtools-installer";
import { autoUpdater } from "electron-updater";
import initializeProject from "./initialize-project/initialize-project";
import { windows } from "../resources/Windows/Windows";

require("dotenv").config();

const isDev = process.env.NODE_ENV === "development";

let win;

// https://stackoverflow.com/a/52195400/9599137, https://www.electron.build/configuration/nsis#guid-vs-application-name
// => Windows 8/8.1 and 10 notifications.
app.setAppUserModelId("com.5k-mirrors.poe-sniper");

autoUpdater.setFeedURL({
  provider: "github",
  owner: "5k-mirrors",
  repo: "poe-sniper",
});

const setupDevelopmentWorkflow = async () => {
  require("electron-debug")();

  await installExtension(REACT_DEVELOPER_TOOLS);

  win.webContents.openDevTools();
};

const createWindow = () => {
  win = new BrowserWindow({
    width: 1024,
    height: 768,
    // https://stackoverflow.com/a/55093701/9599137
    webPreferences: {
      nodeIntegration: true,
    },
  });

  if (isDev) {
    win.loadURL(`file://${process.cwd()}/app/index.html`);
  } else {
    win.loadURL(`file://${__dirname}/index.html`);
  }

  win.on("closed", () => {
    win = null;
  });
};

app.on("ready", async () => {
  createWindow();

  autoUpdater.checkForUpdatesAndNotify();

  if (isDev) {
    await setupDevelopmentWorkflow();
  }

  win.webContents.on("did-finish-load", () => {
    win.setTitle(windows.POE_SNIPER);

    initializeProject();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (win === null) {
    createWindow();
  }
});
