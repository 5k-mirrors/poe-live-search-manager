import WebSocket from "ws";
import { Mutex } from "async-mutex";
import Bottleneck from "bottleneck";
import Store from "./store";
import processItems from "../process-items/process-items";
import {
  devLog,
  devErrorLog,
  safeGet,
  isDefined,
  randomInt,
  retryIn,
} from "../../shared/utils/JavaScriptUtils/JavaScriptUtils";
import { send, sendError } from "../utils/electron-utils/electron-utils";
import getWebSocketUri from "../get-websocket-uri/get-websocket-uri";
import { ipcEvents } from "../../shared/resources/IPCEvents/IPCEvents";
import GlobalStore from "../../shared/GlobalStore/GlobalStore";
import { storeKeys } from "../../shared/resources/StoreKeys/StoreKeys";
import { windows } from "../../shared/resources/Windows/Windows";
import socketStates from "./socket-states";
import stateIs from "../utils/state-is/state-is";
import { socketHeaders } from "../api/api";

class WsRequestLimiter {
  static bottleneck = new Bottleneck({
    maxConcurrent: 1,
    minTime: randomInt(2200, 2500),
  });

  static schedule(cb) {
    return this.bottleneck.schedule(() => cb());
  }
}

class ConcurrentConnectionMutex {
  static mutex = new Mutex();

  static acquire() {
    return this.mutex.acquire();
  }
}

const updateState = (id, socket) => {
  send(windows.MAIN, ipcEvents.SOCKET_STATE_UPDATE, {
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
  // Socket connections are locked to remove race conditions and avoid duplicated connections.
  ConcurrentConnectionMutex.acquire()
    .then(release => {
      const ws = Store.find(id);

      if (!ws) return release();

      if (ws.socket && !stateIs(ws.socket, socketStates.CLOSED))
        return release();

      return WsRequestLimiter.schedule(() => {
        const webSocketUri = getWebSocketUri(ws.searchUrl);
        const game = webSocketUri.includes("poe2") ? "poe2" : "poe";

        devLog(`Connect initiated - ${webSocketUri} / ${ws.id}`);

        ws.socket = new WebSocket(webSocketUri, {
          headers: socketHeaders(),
        });

        Store.update(ws.id, {
          ...ws,
        });

        ws.socket.on("open", () => {
          devLog(`SOCKET OPEN - ${ws.searchUrl} / ${ws.id}`);

          heartbeat(ws.socket);

          updateState(ws.id, ws.socket);
        });

        ws.socket.on("message", response => {
          devLog(`SOCKET MESSAGE - ${ws.searchUrl} / ${ws.id} - ${response}`);
          const parsedResponse = JSON.parse(response);

          const itemIds = safeGet(parsedResponse, ["new"]);

          if (isDefined(itemIds)) {
            processItems(itemIds, ws, game);
          }
        });

        ws.socket.on("ping", () => {
          devLog(`SOCKET PING - ${ws.searchUrl} / ${ws.id}`);

          heartbeat(ws.socket);
        });

        ws.socket.on("error", error => {
          devErrorLog(
            `SOCKET ERROR - ${ws.searchUrl} / ${ws.id} ${error.message}`
          );
          sendError(`Connection error: ${error}`);

          const [reason, code] = error.message.split(": ");
          ws.error = { code: parseInt(code, 10), reason };

          updateState(ws.id, ws.socket);

          ws.socket.close();
        });

        ws.socket.on("close", () => {
          devLog(
            `SOCKET CLOSE - ${ws.searchUrl} / ${ws.id} ${ws.error.code} ${ws.error.reason}`
          );

          updateState(ws.id, ws.socket);

          if (ws.error.code === 429) {
            sendError(
              `Rate limit exceded! Closing connection for ${ws.searchUrl}. This should not happen, please open an issue.`
            );
            return;
          }

          if (ws.error.code === 404) {
            sendError(
              `Search not found. Closing connection for ${ws.searchUrl}.`
            );
            return;
          }

          if (ws.error.code === 401) {
            sendError(
              `Unauthorized. Closing connection for ${ws.searchUrl}. Check Session ID.`
            );
            return;
          }

          const delay = randomInt(2000, 3000);
          devLog(
            `Auto-reconnect to be initiated in ${delay / 1000} seconds - ${
              ws.searchUrl
            } / ${ws.id}`
          );
          retryIn(() => connect(ws.id), delay);
        });

        return release();
      });
    })
    .catch(err => {
      devErrorLog(`Error while connecting to ${id}: `, err);
    });

export const disconnect = id => {
  const ws = Store.find(id);

  if (!ws) {
    devLog(`No disconnect initiated (no such object in store) - ${id}`);
    return;
  }

  if (
    ws.socket &&
    (stateIs(ws.socket, socketStates.OPEN) ||
      stateIs(ws.socket, socketStates.CONNECTING))
  ) {
    devLog(`Disconnect initiated - ${id}`);
    ws.socket.close();

    updateState(ws.id, ws.socket);
  } else if (!ws.socket) {
    devLog(`No disconnect initiated (no socket) - ${id}`);
  } else {
    devLog(
      `No disconnect initiated (socket in wrong state) - ${ws.socket.readyState}`
    );
  }
};

const connectAll = () =>
  Store.sockets.forEach(connectionDetails => connect(connectionDetails.id));

export const disconnectAll = () =>
  Store.sockets.forEach(connectionDetails => disconnect(connectionDetails.id));

export const updateConnections = () => {
  if (GlobalStore.getInstance().get(storeKeys.POE_SESSION_ID)) {
    return connectAll();
  }

  return disconnectAll();
};

export const reconnect = id => disconnect(id);

export const reconnectAll = () => {
  disconnectAll();
  // Disconnect triggers a re-connect in case the socket was already open.
  // In case sockets were not open before we also call connect
  connectAll();
};
