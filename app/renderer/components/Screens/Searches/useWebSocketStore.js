import { useCallback, useEffect, useState } from "react";
import { ipcRenderer } from "electron";

import { uniqueIdGenerator } from "../../../../shared/utils/UniqueIdGenerator/UniqueIdGenerator";
import * as regExes from "../../../../shared/resources/RegExes/RegExes";
import { ipcEvents } from "../../../../shared/resources/IPCEvents/IPCEvents";
import { isDefined } from "../../../../shared/utils/JavaScriptUtils/JavaScriptUtils";

const useWebSocketStore = () => {
  const [webSocketStore, setWebSocketStore] = useState([]);

  const socketStateUpdateListener = useCallback((event, socketDetails) => {
    setWebSocketStore(oldWebSocketStore => {
      const webSocketIndex = oldWebSocketStore.findIndex(
        webSocket => webSocket.id === socketDetails.id
      );

      if (!isDefined(oldWebSocketStore[webSocketIndex])) {
        return oldWebSocketStore;
      }

      const newWebSocketStore = [...oldWebSocketStore];
      newWebSocketStore[webSocketIndex] = {
        ...oldWebSocketStore[webSocketIndex],
        isConnected: socketDetails.isConnected,
      };

      return newWebSocketStore;
    });
  }, []);

  useEffect(() => {
    ipcRenderer.invoke(ipcEvents.GET_SOCKETS).then(result => {
      setWebSocketStore(result);
    });
  }, []);

  useEffect(() => {
    ipcRenderer.on(ipcEvents.SOCKET_STATE_UPDATE, socketStateUpdateListener);

    return () => {
      ipcRenderer.removeListener(
        ipcEvents.SOCKET_STATE_UPDATE,
        socketStateUpdateListener
      );
    };
  }, [socketStateUpdateListener]);

  const reconnect = connectionDetails => {
    ipcRenderer.send(ipcEvents.RECONNECT_SOCKET, connectionDetails);
  };

  const reconnectAll = () => {
    ipcRenderer.send(ipcEvents.RECONNECT_ALL);
  };

  const deleteConnection = connectionDetails => {
    ipcRenderer.send(ipcEvents.WS_REMOVE, connectionDetails);

    setWebSocketStore(
      webSocketStore.filter(webSocket => webSocket.id !== connectionDetails.id)
    );

    return Promise.resolve();
  };

  const addNewConnection = connectionDetails => {
    if (!regExes.poeTradeUrl.test(connectionDetails.searchUrl)) {
      return Promise.reject(
        new Error(`Invalid search url: ${connectionDetails.searchUrl}`)
      );
    }

    const connectionDetailsWithUniqueId = {
      id: uniqueIdGenerator(),
      ...connectionDetails,
    };

    ipcRenderer.send(ipcEvents.WS_ADD, connectionDetailsWithUniqueId);

    setWebSocketStore(oldWebSocketStore => {
      return [
        ...oldWebSocketStore,
        {
          ...connectionDetailsWithUniqueId,
          isConnected: false,
        },
      ];
    });

    return Promise.resolve();
  };

  const deleteAll = () => {
    webSocketStore.forEach(connectionDetails => {
      ipcRenderer.send(ipcEvents.WS_REMOVE, connectionDetails);
    });

    setWebSocketStore([]);
  };

  return {
    webSocketStore,
    reconnect,
    reconnectAll,
    deleteConnection,
    addNewConnection,
    deleteAll,
  };
};

export default useWebSocketStore;
