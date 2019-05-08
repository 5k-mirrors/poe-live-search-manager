import Store from "electron-store";
import setupIPCEvents from "./SetupIPCEvents/SetupIPCEvents";
import * as WebSocketActions from "../WebSockets/Actions/Actions";
import * as JavaScriptUtils from "../../utils/JavaScriptUtils/JavaScriptUtils";

const store = new Store();

const initializeProject = () => {
  setupIPCEvents();

  const storedWsConnections = store.get("wsConnections");

  if (JavaScriptUtils.isDefined(storedWsConnections)) {
    storedWsConnections.forEach(connectionDetails => {
      WebSocketActions.connectToNewWebSocket(connectionDetails);
    });
  }
};

export default initializeProject;
