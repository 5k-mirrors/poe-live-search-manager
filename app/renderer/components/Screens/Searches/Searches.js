import React from "react";
import { ipcRenderer } from "electron";
import MaterialTable from "@material-table/core";
import { Box, Typography } from "@mui/material";
import yaml from "js-yaml";
import fs from "fs";

import { ipcEvents } from "../../../../shared/resources/IPCEvents/IPCEvents";
import * as tableColumns from "../../../resources/TableColumns/TableColumns";
import { devErrorLog } from "../../../../shared/utils/JavaScriptUtils/JavaScriptUtils";
import { deleteAllSearches as deleteAllSearchesMessageBoxOptions } from "../../../resources/MessageBoxOptions/MessageBoxOptions";
import useWebSocketStore from "./useWebSocketStore";
import useNotify from "../../../utils/useNotify";
import useTimeout from "../../../utils/useTimeout";

const Searches = () => {
  const {
    webSocketStore,
    reconnect,
    reconnectAll,
    deleteConnection,
    addNewConnection,
    deleteAll,
  } = useWebSocketStore();
  const SEARCH_COUNT_LIMIT = 20;
  const reconnectTimeout = 4000;
  const {
    isTimeout: isReconnectTimeout,
    timeout: setReconnectTimeout,
  } = useTimeout(reconnectTimeout);
  const { notify, Notification } = useNotify();

  const handleError = error => {
    devErrorLog(error);
    notify(error.toString(), "error");
  };

  const maxSearchCountReached = () => {
    return webSocketStore.length === SEARCH_COUNT_LIMIT;
  };

  const isWebSocketStoreEmpty = () => {
    return webSocketStore.length === 0;
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
                addNewConnection({
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

  const deleteAllCallback = () => {
    ipcRenderer
      .invoke(ipcEvents.MESSAGE_DIALOG, deleteAllSearchesMessageBoxOptions)
      .then(response => {
        const clickedButtonIndex = response.response;
        const deleteAllSearchesConfirmed = clickedButtonIndex === 1;

        if (deleteAllSearchesConfirmed) {
          deleteAll();
        }
      });
  };

  const onRowAddCallback = wsConnectionData => {
    return addNewConnection(wsConnectionData).catch(handleError);
  };

  const onRowDeleteCallback = wsConnectionData => {
    return deleteConnection(wsConnectionData).catch(handleError);
  };

  const onReconnectCallback = wsConnectionData => {
    setReconnectTimeout();
    return reconnect(wsConnectionData);
  };

  const onReconnectAllCallback = () => {
    setReconnectTimeout();
    return reconnectAll();
  };

  return (
    <>
      <MaterialTable
        title="Active connections"
        columns={tableColumns.searchesScreen}
        components={{
          Pagination: () => (
            <Box component="td" padding={2}>
              <Typography
                color={maxSearchCountReached() ? "error" : "initial"}
                variant="subtitle2"
              >
                {`Search count: ${webSocketStore.length}`}
              </Typography>
            </Box>
          ),
        }}
        data={webSocketStore}
        editable={{
          // It's an alternative workaround to control the add icon's visibility: https://github.com/mbrn/@material-table/core/issues/465#issuecomment-482955841
          onRowAdd: maxSearchCountReached() ? undefined : onRowAddCallback,
          onRowDelete: onRowDeleteCallback,
        }}
        actions={[
          {
            icon: "cached",
            tooltip: "Reconnect",
            onClick: (_event, connectionDetails) =>
              onReconnectCallback(connectionDetails),
            disabled: isReconnectTimeout,
          },
          {
            icon: "cached",
            tooltip: "Reconnect all",
            isFreeAction: true,
            disabled: isWebSocketStoreEmpty() || isReconnectTimeout,
            onClick: onReconnectAllCallback,
          },
          {
            icon: "create_new_folder",
            tooltip: maxSearchCountReached()
              ? `Number of searches are limited to ${SEARCH_COUNT_LIMIT} by GGG`
              : "Import from file",
            isFreeAction: true,
            disabled: maxSearchCountReached(),
            onClick: () => importFromFile(),
          },
          {
            icon: "delete_outline",
            tooltip: "Delete all",
            isFreeAction: true,
            onClick: () => deleteAllCallback(),
            // disabled: isWebSocketStoreEmpty(),
          },
          {
            // It's an alternative workaround to control the add icon's visibility: https://github.com/mbrn/@material-table/core/issues/465#issuecomment-482955841
            icon: "add_box",
            tooltip: `Number of searches are limited to ${SEARCH_COUNT_LIMIT} by GGG`,
            isFreeAction: true,
            disabled: true,
            hidden: !maxSearchCountReached(),
            // An anonymus function needs to be provided to avoid invalid prop errors in the console.
            onClick: () => {},
          },
        ]}
        options={{
          showTitle: false,
          toolbarButtonAlignment: "left",
          headerStyle: {
            position: "sticky",
            top: 0,
          },
          maxBodyHeight: "525px",
          pageSize: 9999,
          emptyRowsWhenPaging: false,
          addRowPosition: "first",
        }}
      />
      <Notification />
    </>
  );
};

export default Searches;
