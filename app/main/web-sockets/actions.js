import WebSocket from "ws";
import store from "./store";
import Subscription from "../../Subscription/Subscription";
import processItems from "../process-items/process-items";
import {
  devLog,
  devErrorLog,
  safeGet,
  isDefined,
} from "../../utils/JavaScriptUtils/JavaScriptUtils";
import * as electronUtils from "../utils/electron-utils/electron-utils";
import getWebSocketUri from "../get-websocket-uri/get-websocket-uri";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";
import SingletonGlobalStore from "../../GlobalStore/GlobalStore";
import { storeKeys } from "../../resources/StoreKeys/StoreKeys";
import { windows } from "../../resources/Windows/Windows";
import socketStates from "../../resources/SocketStates/SocketStates";
import mutex from "../mutex/mutex";
import stateIs from "../utils/state-is/state-is";
import getCookieHeader from "../utils/get-cookie-header/get-cookie-header";
import webSocketLimiter from "./limiter";

const updateState = (id, socket) => {
  electronUtils.send(windows.MAIN, ipcEvents.SOCKET_STATE_UPDATE, {
    id,
    isConnected: socket && stateIs(socket, socketStates.OPEN),
  });
};

const serverPingTimeframeSeconds = 30;
const pingAllowedDelaySeconds = 1;

const heartbeat = socket => {
  clearTimeout(socket.pingTimeout);

  // Timeouts need to be defined per WebSocket
  // eslint-disable-next-line no-param-reassign
  socket.pingTimeout = setTimeout(() => {
    socket.terminate();
  }, (serverPingTimeframeSeconds + pingAllowedDelaySeconds) * 1000);
};

const connect = id =>
  mutex
    .acquire()
    .then(release => {
      const ws = store.find(id);

      if (!ws) return release();

      if (ws.socket && !stateIs(ws.socket, socketStates.CLOSED))
        return release();

      const limiter = webSocketLimiter.getInstance();

      return limiter.schedule(() => {
        const webSocketUri = getWebSocketUri(ws.searchUrl);

        devLog(`Connect initiated - ${webSocketUri} / ${ws.id}`);

        ws.socket = new WebSocket(webSocketUri, {
          headers: {
            Cookie: getCookieHeader(),
          },
        });

        store.update(ws.id, {
          ...ws,
        });

        ws.socket.on("open", () => {
          devLog(`SOCKET OPEN - ${ws.searchUrl} / ${ws.id}`);

          heartbeat(ws.socket);

          updateState(ws.id, ws.socket);
        });

        ws.socket.on("message", response => {
          const parsedResponse = JSON.parse(response);

          const itemIds = safeGet(parsedResponse, ["new"]);

          if (isDefined(itemIds)) {
            processItems(itemIds, ws);
          }
        });

        ws.socket.on("ping", () => {
          devLog(`SOCKET PING - ${ws.searchUrl} / ${ws.id}`);

          heartbeat(ws.socket);
        });

        ws.socket.on("error", error => {
          devErrorLog(`SOCKET ERROR - ${ws.searchUrl} / ${ws.id} ${error}`);

          updateState(ws.id, ws.socket);

          ws.socket.close();
        });

        ws.socket.on("close", (code, reason) => {
          devLog(`SOCKET CLOSE - ${ws.searchUrl} / ${ws.id} ${code} ${reason}`);

          const globalStore = new SingletonGlobalStore();

          updateState(ws.id, ws.socket);

          const isLoggedIn = globalStore.get(storeKeys.IS_LOGGED_IN, false);

          if (isLoggedIn && Subscription.active()) {
            setTimeout(() => {
              devLog(`Auto-reconnect initiated - ${ws.searchUrl} / ${ws.id}`);

              connect(ws.id);
            }, 500);
          }
        });

        return release();
      });
    })
    .catch(err => {
      devErrorLog(`Error while connecting to ${id}: `, err);
    });

export const disconnect = id => {
  const ws = store.find(id);

  if (!ws) return;

  devLog(`Disconnect initiated - ${id}`);

  if (
    ws.socket &&
    (stateIs(ws.socket, socketStates.OPEN) ||
      stateIs(ws.socket, socketStates.CONNECTING))
  ) {
    ws.socket.close();

    updateState(ws.id, ws.socket);
  }
};

const connectAll = () =>
  store.all().forEach(connectionDetails => connect(connectionDetails.id));

export const disconnectAll = () =>
  store.all().forEach(connectionDetails => disconnect(connectionDetails.id));

export const updateConnections = () => {
  const globalStore = new SingletonGlobalStore();

  const isLoggedIn = globalStore.get(storeKeys.IS_LOGGED_IN, false);
  const poeSessionId = globalStore.get(storeKeys.POE_SESSION_ID);

  const conditionsAreFulfilled =
    isLoggedIn && poeSessionId && Subscription.active();

  if (conditionsAreFulfilled) {
    return connectAll();
  }

  return disconnectAll();
};

export const reconnect = id => disconnect(id);

export const reconnectAll = () => disconnectAll();
