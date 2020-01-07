import WebSocket from "ws";
import store from "./store";
import subscription from "../../Subscription/Subscription";
import processItems from "../process-items/process-items";
import * as javaScriptUtils from "../../utils/JavaScriptUtils/JavaScriptUtils";
import * as electronUtils from "../utils/electron-utils/electron-utils";
import getWebSocketUri from "../get-websocket-uri/get-websocket-uri";
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";
import { globalStore } from "../../GlobalStore/GlobalStore";
import { storeKeys } from "../../resources/StoreKeys/StoreKeys";
import { windows } from "../../resources/Windows/Windows";
import socketStates from "../../resources/SocketStates/SocketStates";
import mutex from "../mutex/mutex";
import stateIs from "../utils/state-is/state-is";
import getCookieHeader from "../utils/get-cookie-header/get-cookie-header";
import webSocketLimiter from "./limiter";

const updateState = (id, socket) => {
  electronUtils.send(windows.POE_SNIPER, ipcEvents.SOCKET_STATE_UPDATE, {
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

        javaScriptUtils.devLog(
          `Connect initiated - ${webSocketUri} / ${ws.id}`
        );

        ws.socket = new WebSocket(webSocketUri, {
          headers: {
            Cookie: getCookieHeader(),
          },
        });

        store.update(ws.id, {
          ...ws,
        });

        ws.socket.on("open", () => {
          javaScriptUtils.devLog(`SOCKET OPEN - ${ws.searchUrl} / ${ws.id}`);

          heartbeat(ws.socket);

          updateState(ws.id, ws.socket);
        });

        ws.socket.on("message", response => {
          const parsedResponse = JSON.parse(response);

          const itemIds = javaScriptUtils.safeGet(parsedResponse, ["new"]);

          if (javaScriptUtils.isDefined(itemIds)) {
            processItems(itemIds, ws);
          }
        });

        ws.socket.on("ping", () => {
          javaScriptUtils.devLog(`SOCKET PING - ${ws.searchUrl} / ${ws.id}`);

          heartbeat(ws.socket);
        });

        ws.socket.on("error", error => {
          javaScriptUtils.devLog(
            `SOCKET ERROR - ${ws.searchUrl} / ${ws.id} ${error}`
          );

          updateState(ws.id, ws.socket);

          ws.socket.close();
        });

        ws.socket.on("close", (code, reason) => {
          javaScriptUtils.devLog(
            `SOCKET CLOSE - ${ws.searchUrl} / ${ws.id} ${code} ${reason}`
          );

          updateState(ws.id, ws.socket);

          const isLoggedIn = globalStore.get(storeKeys.IS_LOGGED_IN, false);

          if (isLoggedIn && subscription.active()) {
            setTimeout(() => {
              javaScriptUtils.devLog(
                `Auto-reconnect initiated - ${ws.searchUrl} / ${ws.id}`
              );

              connect(ws.id);
            }, 500);
          }
        });

        return release();
      });
    })
    .catch(err => {
      javaScriptUtils.devErrorLog(`Error while connecting to ${id}:`);
      javaScriptUtils.devErrorLog(err);
    });

export const disconnect = id => {
  const ws = store.find(id);

  if (!ws) return;

  javaScriptUtils.devLog(`Disconnect initiated - ${id}`);

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
  const isLoggedIn = globalStore.get(storeKeys.IS_LOGGED_IN, false);
  const poeSessionId = globalStore.get(storeKeys.POE_SESSION_ID);

  const conditionsAreFulfilled =
    isLoggedIn && poeSessionId && subscription.active();

  if (conditionsAreFulfilled) {
    return connectAll();
  }

  return disconnectAll();
};

export const reconnect = id => disconnect(id);

export const reconnectAll = () => disconnectAll();
