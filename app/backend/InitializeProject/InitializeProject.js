import Store from "electron-store";
import setupIpcEvents from "./SetupIPCEvents/SetupIPCEvents";
import * as WebSocketActions from "../WebSockets/Actions/Actions";
import * as JavaScriptUtils from "../utils/JavaScriptUtils/JavaScriptUtils";

const store = new Store();

const initializeProject = () => {
  setupIpcEvents();

  const storedWsConnections = store.get("wsConnections");

  if (JavaScriptUtils.isDefined(storedWsConnections)) {
    storedWsConnections.forEach(connectionDetails => {
      WebSocketActions.connectToNewWebSocket(connectionDetails);
    });
  }
};

export default initializeProject;
