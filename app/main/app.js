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
import { windows } from "../shared/resources/Windows/Windows";
import {
  envIs,
  devErrorLog,
  devLog,
} from "../shared/utils/JavaScriptUtils/JavaScriptUtils";

require("electron-unhandled")({
  showDialog: envIs("development"),
});

let win;

// https://stackoverflow.com/a/52195400/9599137, https://www.electron.build/configuration/nsis#guid-vs-application-name
// => Windows 8/8.1 and 10 notifications.
app.setAppUserModelId("com.5k-mirrors.poe-sniper");

// https://github.com/c-hive/poe-sniper/issues/287
// The user data folder is determined based on the app's name. After changing the name this makes sure users with old installation don't lose their data. Their installation will keep using the old user data folder, unless it's explicitly removed.
// In dev env the app is using the "Electron" folder. Only activate this fix in production so development doesn't interfere with user installations.
if (envIs("production")) {
  try {
    const userDataPathFromPreviousInstallation = `${app.getPath("appData")}${
      path.sep
    }PoE Sniper`;

    if (fs.existsSync(userDataPathFromPreviousInstallation)) {
      app.setPath("userData", userDataPathFromPreviousInstallation);
    }
  } catch (err) {
    devErrorLog(err);
  }
}

const logger = require("electron-log");

autoUpdater.logger = logger;
autoUpdater.setFeedURL({
  provider: "github",
  owner: "5k-mirrors",
  repo: "poe-live-search-manager",
});

if (envIs("development") && process.env.UPDATE) {
  autoUpdater.updateConfigPath = path.join(
    __dirname,
    "..",
    "..",
    "dev-app-update.yml"
  );
  autoUpdater.on("update-available", () => {
    devLog("update available");
  });
  autoUpdater.on("update-not-available", () => {
    devLog("update not available");
  });

  devLog("Checking for updates, you should see update related messages below");

  // Customize the test by toggling these lines
  // autoUpdater.autoDownload = false
  autoUpdater.autoInstallOnAppQuit = false;

  autoUpdater.checkForUpdates();
}

const setupDevelopmentWorkflow = () => {
  // eslint-disable-next-line global-require
  require("electron-debug")();

  installExtension(REACT_DEVELOPER_TOOLS)
    .then(() => {
      win.webContents.openDevTools();
    })
    .catch(error => {
      devErrorLog(`Failed to install React dev tools: ${error}`);
    });
};

const createWindow = () => {
  const width = envIs("development") ? 1524 : 1024;
  win = new BrowserWindow({
    width,
    height: 768,
    webPreferences: {
      // https://stackoverflow.com/a/55093701/9599137
      nodeIntegration: true,
      // Require by electron-store on electron v10+
      enableRemoteModule: true,
    },
  });

  if (process.platform !== "darwin" && !envIs("development")) {
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

app.whenReady().then(() => {
  // Subscribing to the listeners happens even before creating the window to be ready to actively respond to initial events coming from renderer.
  initListeners();

  createWindow();
  autoUpdater.checkForUpdatesAndNotify();

  if (envIs("development")) {
    setupDevelopmentWorkflow();
    devLog("Development setup done");
  }

  win.webContents.on("did-finish-load", () => {
    win.setTitle(windows.MAIN);

    initRateLimiter();
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
