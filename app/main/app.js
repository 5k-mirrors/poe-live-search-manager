import { app, BrowserWindow } from "electron";
import installExtension, {
  REACT_DEVELOPER_TOOLS,
} from "electron-devtools-installer";
import {
  initListeners,
  initRateLimiter,
  ensureEnv,
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
app.setAppUserModelId("com.5k-mirrors.poe-live-search-manager");

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
      // https://stackoverflow.com/a/66604710/2771889
      nodeIntegration: true,
      contextIsolation: false,
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
  ensureEnv();

  // Subscribing to the listeners happens even before creating the window to be ready to actively respond to initial events coming from renderer.
  initListeners();

  createWindow();

  if (envIs("development")) {
    setupDevelopmentWorkflow();
    devLog("Development setup done");
  }

  initRateLimiter();

  win.webContents.on("did-finish-load", () => {
    win.setTitle(windows.MAIN);
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
