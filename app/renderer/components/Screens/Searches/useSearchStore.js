import { useCallback, useEffect, useState } from "react";
import { ipcRenderer } from "electron";

import { uniqueIdGenerator } from "../../../../shared/utils/UniqueIdGenerator/UniqueIdGenerator";
import * as regExes from "../../../../shared/resources/RegExes/RegExes";
import { ipcEvents } from "../../../../shared/resources/IPCEvents/IPCEvents";
import { isDefined } from "../../../../shared/utils/JavaScriptUtils/JavaScriptUtils";

const useSearchStore = (name) => {
  const createInitialState = () => {
    return JSON.parse(localStorage.getItem('searchState' + name) || '[]');
  }

  const [searchStore, setSearchStore] = useState(createInitialState);

  // Searches logic
  // Update localStorage when the store state changes.
  useEffect(() => {
    localStorage.setItem('searchState' + name, JSON.stringify(searchStore))
  }, [searchStore]);

  const deleteSearch = searchDetails => {
    const newState = searchStore.filter(search => search.id !== searchDetails.id);
    setSearchStore(newState);

    return Promise.resolve();
  };

  const addNewSearch = searchDetails => {
    if (!regExes.poeTradeUrl.test(searchDetails.searchUrl)) {
      return Promise.reject(
        new Error(`Invalid search url: ${searchDetails.searchUrl}`)
      );
    }

    const searchDetailsWithUniqueId = {
      id: uniqueIdGenerator(),
      ...searchDetails,
    };

    ipcRenderer.send(ipcEvents.WS_ADD, searchDetailsWithUniqueId);

    setSearchStore(oldSearchStore => {
      const newState = [
        ...oldSearchStore,
        {
          ...searchDetailsWithUniqueId,
          isConnected: false,
        },
      ];

      return newState;
    });

    return Promise.resolve();
  };

  const deleteAllSearches = () => {
    setSearchStore([]);
    localStorage.removeItem('searchState' + name);
  };

  // Websocket logic
  // Update state on socket events
  const socketStateUpdateListener = useCallback((_event, socketDetails) => {
    setSearchStore(oldSearchStore => {
      const webSocketIndex = oldSearchStore.findIndex(
        webSocket => webSocket.id === socketDetails.id
      );

      if (!isDefined(oldSearchStore[webSocketIndex])) {
        return oldSearchStore;
      }

      const newSearchStore = [...oldSearchStore];
      newSearchStore[webSocketIndex] = {
        ...oldSearchStore[webSocketIndex],
        isConnected: socketDetails.isConnected,
      };

      return newSearchStore;
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

  // Set initial socket state
  useEffect(() => {
    ipcRenderer.invoke(ipcEvents.GET_SOCKETS).then(connectedSockets => {
      setSearchStore(currentSearches => {
        return currentSearches.map(search => {
          const socket = connectedSockets.find(socket => search.id === socket.id);

          if (socket) {
            search.isConnected = connectedSockets.find(socket => search.id === socket.id).isConnected || false;
          }

          return search;
        });
      })
    });
  }, []);

  const connectGroup = () => {
    searchStore.forEach((connectionDetails) => {
      ipcRenderer.send(ipcEvents.WS_ADD, connectionDetails);
      ipcRenderer.send(ipcEvents.CONNECT_SOCKET, connectionDetails);
    })
  }

  const disconnectGroup = () => {
    searchStore.forEach(connectionDetails => {
      ipcRenderer.send(ipcEvents.WS_REMOVE, connectionDetails);
    });
  }

  const reconnectSearch = connectionDetails => {
    ipcRenderer.send(ipcEvents.RECONNECT_SOCKET, connectionDetails);
  };

  return {
    name,
    searchStore,
    deleteSearch,
    addNewSearch,
    deleteAllSearches,
    connectGroup,
    disconnectGroup,
    reconnectSearch,
  };
};

export default useSearchStore;
