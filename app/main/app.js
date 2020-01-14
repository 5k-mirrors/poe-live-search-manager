/* eslint-disable global-require */
import { app, BrowserWindow } from "electron";
import fs from "fs";
import path from "path";
import installExtension, {
  REACT_DEVELOPER_TOOLS,
} from "electron-devtools-installer";
import { autoUpdater } from "electron-updater";
import {
  initListeners,
  initRateLimiter,
} from "./initialize-project/initialize-project";
import { windows } from "../resources/Windows/Windows";
import { envIs, devErrorLog } from "../utils/JavaScriptUtils/JavaScriptUtils";

require("electron-unhandled")({
  showDialog: envIs("development"),
});

let win;

// https://stackoverflow.com/a/52195400/9599137, https://www.electron.build/configuration/nsis#guid-vs-application-name
// => Windows 8/8.1 and 10 notifications.
app.setAppUserModelId("com.5k-mirrors.poe-sniper");

if (envIs("production")) {
  try {
    // The app explicitly uses the PoE Sniper's folder if exists so that the settings are kept regardless of the app's name.
    const poeSniperConfigs = `${app.getPath("appData")}${path.sep}PoE Sniper`;

    if (fs.existsSync(poeSniperConfigs)) {
      app.setPath("userData", poeSniperConfigs);
    }
  } catch (err) {
    devErrorLog(err);
  }
}

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

  if (process.platform !== "darwin") {
    // https://electronjs.org/docs/api/browser-window#winremovemenu-linux-windows
    win.removeMenu();
  }

  if (envIs("development")) {
    win.loadURL(`file://${process.cwd()}/app/index.html`);
  } else {
    win.loadURL(`file://${__dirname}/index.html`);
  }

  win.on("closed", () => {
    win = null;
  });
};

app.on("ready", async () => {
  // Subscribing to the listeners happens even before creating the window to be ready to actively respond to initial events coming from renderer.
  initListeners();

  createWindow();

  autoUpdater.checkForUpdatesAndNotify();

  if (envIs("development")) {
    await setupDevelopmentWorkflow();
  }

  win.webContents.on("did-finish-load", async () => {
    win.setTitle(windows.POE_SNIPER);

    await initRateLimiter();
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
