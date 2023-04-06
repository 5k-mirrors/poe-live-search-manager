import React, { useEffect, useState } from "react";
import { ipcRenderer } from "electron";
import { ipcEvents } from "../../../../shared/resources/IPCEvents/IPCEvents";

import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

import Table from "./Table";
import useNotify from "../../../utils/useNotify";
import useTimeout from "../../../utils/useTimeout";

const Searches = () => {
  // Group management logic
  const createInitialState = () => {
    return JSON.parse(localStorage.getItem('groupsState') || '[]');
  }

  const [groups, setGroups] = useState(createInitialState);
  const [connectedCount, setConnectedCount] = useState(0);

  // Update localStorage when the group state changes.
  useEffect(() => {
    localStorage.setItem('groupsState', JSON.stringify(groups))
  }, [groups])

  const createGroup = (name) => {
    return {
      name: name
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
  const SEARCH_COUNT_LIMIT = 20;
  const reconnectTimeout = 4000;
  const { notify, Notification } = useNotify();
  const { isTimeout: isReconnectTimeout, timeout: setReconnectTimeout } = useTimeout(reconnectTimeout);

  const connectGroup = (name, searches) => {
    // Add to total connected count
    setConnectedCount(currentCount => {
      return currentCount + searches.searchStore.length;
    });

    setReconnectTimeout();
  }

  const disconnectGroup = (name, searches) => {
    // Add to total connected count
    setConnectedCount(currentCount => {
      return currentCount - searches.searchStore.length;
    });
  }

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
          searchLimit={SEARCH_COUNT_LIMIT}
          connectedCount={connectedCount}
          notify={notify}
        />
      ))}
      <Button variant="outlined" startIcon={<AddIcon />} onClick={() => addGroupCallback()} sx={{marginTop: 1}}> Add Group</Button>
      <Notification />
    </>
  );
};

export default Searches;
