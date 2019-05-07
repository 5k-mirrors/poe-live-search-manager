import setupIpcEvents from "./SetupIPCEvents/SetupIPCEvents";
import * as WebSocketActions from "../WebSockets/Actions/Actions";
import * as StoreUtils from "../../utils/StoreUtils/StoreUtils";
import * as JavaScriptUtils from "../../utils/JavaScriptUtils/JavaScriptUtils";

const initializeProject = () => {
  setupIpcEvents();

  const storedWsConnections = StoreUtils.getItem("wsConnections");

  if (JavaScriptUtils.arrayIsNotEmpty(storedWsConnections)) {
    storedWsConnections.forEach(connectionDetails => {
      WebSocketActions.connectToNewWebSocket(connectionDetails);
    });
  }
};

export default initializeProject;
