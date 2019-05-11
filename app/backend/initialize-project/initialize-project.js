import { ipcMain } from "electron";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";
import * as WebSocketActions from "../web-sockets/actions/actions";
import * as JavaScriptUtils from "../../utils/JavaScriptUtils/JavaScriptUtils";
import { globalStore } from "../../GlobalStore/GlobalStore";

const setupIpcEvents = () => {
  ipcMain.on(ipcEvents.WS_CONNECT, (_, connectionDetails) => {
    WebSocketActions.connectToNewWebSocket(connectionDetails);
  });

  ipcMain.on(ipcEvents.WS_DISCONNECT, (_, connectionDetails) => {
    WebSocketActions.disconnectFromWebSocket(connectionDetails);
  });
};

const initializeProject = () => {
  setupIpcEvents();

  const storedWsConnections = globalStore.get("wsConnections");

  if (JavaScriptUtils.isDefined(storedWsConnections)) {
    storedWsConnections.forEach(connectionDetails => {
      WebSocketActions.connectToNewWebSocket(connectionDetails);
    });
  }
};

export default initializeProject;
