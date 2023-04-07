import React from "react";
import { ipcRenderer } from "electron";

import yaml from "js-yaml";
import fs from "fs";

import MaterialTable from "@material-table/core";
import { Box, Typography } from "@mui/material";

import { deleteAllSearches as deleteAllSearchesMessageBoxOptions } from "../../../resources/MessageBoxOptions/MessageBoxOptions";
import * as tableColumns from "../../../resources/TableColumns/TableColumns";
import { devErrorLog } from "../../../../shared/utils/JavaScriptUtils/JavaScriptUtils";
import { ipcEvents } from "../../../../shared/resources/IPCEvents/IPCEvents";

import useSearchStore from "./useSearchStore";

const Table = ({state, onGroupDelete, onGroupConnect, onGroupDisconnect, isReconnectTimeout, searchLimit, connectedCount, notify }) => {
  const name = state.name;

  const searches = useSearchStore(name);

  const maxSearchCountReached = () => {
    return searches.searchStore.length === searchLimit;
  };

  const onRowAddCallback = (searchData) => {
    return searches.addNewSearch(searchData).catch(handleError);
  };

  const onRowDeleteCallback = (searchData) => {
    return searches.deleteSearch(searchData).catch(handleError);
  };

  const deleteGroupCallback = (index) => {
    ipcRenderer
    .invoke(ipcEvents.MESSAGE_DIALOG, deleteAllSearchesMessageBoxOptions)
    .then(response => {
      const clickedButtonIndex = response.response;
      const deleteAllSearchesConfirmed = clickedButtonIndex === 1;

      if (deleteAllSearchesConfirmed) {
        searches.deleteAllSearches();
        onGroupDelete(name);
      }
    });
  };

  const importFromFile = () => {
    ipcRenderer
      .invoke(ipcEvents.OPEN_DIALOG, {
        properties: ["openFile"],
        filters: [{ name: "YAML", extensions: ["yml", "yaml"] }],
      })
      .then(result => {
        if (result.filePaths) {
          fs.readFile(result.filePaths[0], "utf8", (err, data) => {
            try {
              if (err) throw err;
              const input = yaml.safeLoad(data);
              for (const [url, name] of Object.entries(input.pathofexilecom)) {
                searches.addNewSearch({
                  searchUrl: url,
                  name,
                }).catch(handleError);
              }
            } catch (error) {
              handleError(error);
            }
          });
        }
      })
      .catch(handleError);
  };

  const importFromBetterTrade = (group) => {
    ipcRenderer
      .invoke(ipcEvents.INPUT_DIALOG, {
        title: 'BetterTrade Import',
        label: 'Import string:',
        type: 'input',
      })
      .then(response => {
        response = response.slice(2);
        response = Buffer.from(response, 'base64');
        response = JSON.parse(response);

        console.log(response);

        response.trs.forEach(el => {
          if (searches.searchStore.length == 20 || el.loc.startsWith('exchange:')) return;

          const location = el.loc.endsWith('/live', 5) ? el.loc.slice(7) : el.loc.slice(7) + '/live';
          searches.addNewSearch({name: el.tit, searchUrl: 'https://www.pathofexile.com/trade/search/crucible/' + location}).catch(handleError);
        });
      })
      .catch(handleError);
  };

  const handleError = error => {
    devErrorLog(error);
    notify(error.toString(), "error");
  };

  const connectGroup = () => {
    searches.connectGroup();
    onGroupConnect(name, searches); // Call parent;
  }

  const disconnectGroup = () => {
    searches.disconnectGroup();
    onGroupDisconnect(name, searches); // Call parent;
  }

  const onSearchReconnect = (search) => {
    searches.reconnectSearch(search);
  }

  const hasConnectedSearch = () => {
    return !!searches.searchStore.filter(el => el.isConnected === true).length;
  }

  return (
    <MaterialTable
      key={name}
      title={name}
      columns={tableColumns.searchesScreen}
      components={{
        Pagination: () => (
          <Box component="td" padding={2}>
            <Typography
              color={maxSearchCountReached() ? "error" : "inherit"}
              variant="subtitle2"
            >
              {`Search count: ${searches.searchStore.length}`}
            </Typography>
          </Box>
        ),
      }}
      data={searches.searchStore}
      editable={{
        // It's an alternative workaround to control the add icon's visibility: https://github.com/mbrn/material-table/issues/465#issuecomment-482955841
        onRowAdd: maxSearchCountReached() ? undefined : newData => onRowAddCallback(newData),
        onRowDelete: data => onRowDeleteCallback(data),
      }}
      actions={[
        // Global actions
        {
          icon: "link",
          tooltip: "Connect all",
          position: 'toolbar',
          disabled: hasConnectedSearch() || isReconnectTimeout || connectedCount+searches.searchStore.length > searchLimit,
          onClick: () => connectGroup(name, searches),
        },
        {
          icon: "link_off",
          tooltip: "Disconnect all",
          position: 'toolbar',
          disabled: !hasConnectedSearch(),
          onClick: () => disconnectGroup(name),
        },
        {
          icon: "create_new_folder",
          tooltip: maxSearchCountReached()
            ? `Number of searches are limited to ${searchLimit} by GGG`
            : "Import from file",
            position: 'toolbar',
          disabled: maxSearchCountReached(),
          onClick: () => importFromFile(),
        },
        {
          icon: "create_new_folder",
          tooltip: maxSearchCountReached()
            ? `Number of searches are limited to ${searchLimit} by GGG`
            : "Import from BetterTrade (20 search per group max, extra will be discarded)",
            position: 'toolbar',
          disabled: maxSearchCountReached(),
          onClick: () => importFromBetterTrade(),
        },
        {
          icon: "delete_outline",
          tooltip: "Delete all",
          position: 'toolbar',
          onClick: () => deleteGroupCallback(),
        },
        {
          // It's an alternative workaround to control the add icon's visibility: https://github.com/mbrn/material-table/issues/465#issuecomment-482955841
          icon: "add_box",
          tooltip: `Number of searches are limited to ${searchLimit} by GGG`,
          position: 'toolbar',
          disabled: true,
          hidden: !maxSearchCountReached(),
        },
        // Individual actions - delete included by setting onRowDelete editable field above
        {
          icon: "cached",
          tooltip: "Reconnect",
          disabled: isReconnectTimeout,
          onClick: (_event, connectionDetails) =>
            onSearchReconnect(connectionDetails),
        },
      ]}
      options={{
        showTitle: true,
        toolbarButtonAlignment: "left",
        headerStyle: {
          position: "sticky",
          top: 0,
        },
        maxBodyHeight: "525px",
        pageSize: 20,
        emptyRowsWhenPaging: false,
        addRowPosition: "first",
      }}
      style={{
        marginTop:16
      }}
    />
  );
};

export default Table;
