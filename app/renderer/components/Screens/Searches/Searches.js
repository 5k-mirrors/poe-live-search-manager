import React, { useEffect, useState } from "react";
import { ipcRenderer } from "electron";
import { ipcEvents } from "../../../../shared/resources/IPCEvents/IPCEvents";

import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

import Table from "./Table";
import useWebSocketStore from "./useWebSocketStore";
import useNotify from "../../../utils/useNotify";
import useTimeout from "../../../utils/useTimeout";

const Searches = () => {
  // Group management logic
  const [groups, setGroups] = useState(JSON.parse(localStorage.getItem('groupsState') || '[]'));;

  useEffect(() => {
    localStorage.setItem('groupsState', JSON.stringify(groups))
  }, [groups])

  const createGroup = (name) => {
    return {
      name: name,
      connected: false,
    };
  }

  const addGroupCallback = () => {
    ipcRenderer
    .invoke(ipcEvents.INPUT_DIALOG, {
      title: 'Group Name',
      label: 'name:',
      type: 'input',
    })
    .then(response => {
      setGroups(oldGroups => {
        return [
          ...oldGroups,
          createGroup(response),
        ];
      });
    });
  };

  const deleteGroupCallback = (name) => {
    setGroups(groups.filter((group) => group.name !== name));
  };

  // Websocket logic
  const {
    webSocketStore,
    reconnect,
    reconnectAll,
    deleteConnection,
    addNewConnection,
    deleteAll,
    addWebsocketGroup
  } = useWebSocketStore();

  const reconnectTimeout = 4000;
  const { notify, Notification } = useNotify();
  const { isTimeout: isReconnectTimeout, timeout: setReconnectTimeout } = useTimeout(reconnectTimeout);

  const connectGroup = (name, searches) => {
    disconnectAllGroups()

    setGroups(currentGroups => {
      currentGroups.find(group => group.name === name).connected = true;
      return currentGroups;
    })

    setReconnectTimeout();
    addWebsocketGroup(searches.searchesStore);
  }

  const disconnectGroup = (name) => {
    disconnectAllGroups()
  }

  const disconnectAllGroups = () => {
    disconnectWebsockets();

    setGroups(currentGroups => {
      currentGroups.forEach((group) => {
        group.connected = false;
      })

      return currentGroups;
    })
  }

  const onReconnectCallback = wsConnectionData => {
    setReconnectTimeout();
    return reconnect(wsConnectionData);
  };

  const isWebSocketStoreEmpty = () => {
    return webSocketStore.length === 0;
  };

  const disconnectWebsockets = () => {
    deleteAll();
  };

  return (
    <>
      {groups.map((group) => (
        <Table
          key={group.name}
          state={group}
          onGroupDelete={deleteGroupCallback}
          onGroupConnect={connectGroup}
          onGroupDisconnect={disconnectGroup}
          isReconnectTimeout={isReconnectTimeout}
        />
      ))}
      <Button variant="outlined" startIcon={<AddIcon />} onClick={() => addGroupCallback()}> Add Group</Button>
      <Notification />
    </>
  );
};

export default Searches;
