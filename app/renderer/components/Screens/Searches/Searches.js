import React, { useCallback, useEffect, useState, useRef } from "react";
import { remote, ipcRenderer } from "electron";
import MaterialTable from "@material-table/core";
import { Box, Typography } from "@mui/material";
import yaml from "js-yaml";
import fs from "fs";
import * as tableColumns from "../../../resources/TableColumns/TableColumns";
import { ipcEvents } from "../../../../shared/resources/IPCEvents/IPCEvents";
import { uniqueIdGenerator } from "../../../../shared/utils/UniqueIdGenerator/UniqueIdGenerator";
import * as regExes from "../../../../shared/resources/RegExes/RegExes";
import {
  devErrorLog,
  isDefined,
} from "../../../../shared/utils/JavaScriptUtils/JavaScriptUtils";
import { deleteAllSearches as deleteAllSearchesMessageBoxOptions } from "../../../resources/MessageBoxOptions/MessageBoxOptions";

const Searches = () => {
  const [webSocketStore, setWebSocketStore] = useState([]);
  // const [allReconnectsAreDisabled, setAllReconnectsAreDisabled] = useState(
  //   false
  // );

  // const disableDurationInMilliseconds = 2000;
  const searchCountLimit = 20;
  // Reconnect buttons are disabled for a short period.
  // This array is tracking active timeout calls so that they can be cleared when the component unmounts.
  // TODO: maybe this complicates too much?
  // const [reconnectTimeoutIds, setReconnectTimeoutIds] = useState([]);
  // const reconnectTimeoutIds = useRef([]);

  const socketStateUpdateListener = useCallback((event, socketDetails) => {
    const update = (id, data) => {
      setWebSocketStore(oldWebSocketStore => {
        const webSocketIndex = oldWebSocketStore.findIndex(
          webSocket => webSocket.id === id
        );

        if (!isDefined(oldWebSocketStore[webSocketIndex])) {
          return oldWebSocketStore;
        }

        const newWebSocketStore = [...oldWebSocketStore];
        newWebSocketStore[webSocketIndex] = {
          ...oldWebSocketStore[webSocketIndex],
          ...data,
        };

        return newWebSocketStore;
      });
    };

    update(socketDetails.id, {
      isConnected: socketDetails.isConnected,
    });
  }, []);

  useEffect(() => {
    ipcRenderer.invoke(ipcEvents.GET_SOCKETS).then(result => {
      setWebSocketStore(result);
    });

    ipcRenderer.on(ipcEvents.SOCKET_STATE_UPDATE, socketStateUpdateListener);

    return () => {
      ipcRenderer.removeListener(
        ipcEvents.SOCKET_STATE_UPDATE,
        socketStateUpdateListener
      );

      // reconnectTimeoutIds.current.forEach(timeout => {
      //   clearTimeout(timeout);
      // });
    };
  }, [socketStateUpdateListener]);

  const maxSearchCountReached = () => {
    return webSocketStore.length === searchCountLimit;
  };

  const disableAllReconnects = () => {
    // setAllReconnectsAreDisabled(true);
    // reconnectTimeoutIds.current.push(
    //   setTimeout(() => {
    //     setAllReconnectsAreDisabled(false);
    //   }, disableDurationInMilliseconds)
    // );
  };

  const disableReconnect = id => {
    // TODO set last reconnect time instead?
    // update(id, {
    //   reconnectIsDisabled: true,
    // });
    // reconnectTimeoutIds.push(
    //   setTimeout(() => {
    //     update(id, { reconnectIsDisabled: false });
    //   }, disableDurationInMilliseconds)
    // );
  };

  const reconnect = connectionDetails => {
    disableReconnect(connectionDetails.id);

    ipcRenderer.send(ipcEvents.RECONNECT_SOCKET, connectionDetails);
  };

  const reconnectAll = () => {
    disableAllReconnects();

    ipcRenderer.send(ipcEvents.RECONNECT_ALL);
  };

  const deleteConnection = connectionDetails => {
    return new Promise(resolve => {
      const updatedWebSocketStore = webSocketStore.filter(
        webSocket => webSocket.id !== connectionDetails.id
      );

      ipcRenderer.send(ipcEvents.WS_REMOVE, connectionDetails);

      setWebSocketStore(updatedWebSocketStore);

      resolve();
    });
  };

  const addNewConnection = connectionDetails => {
    return new Promise((resolve, reject) => {
      if (
        !regExes.searchUrlLeagueAndIdMatcher.test(connectionDetails.searchUrl)
      ) {
        return reject(
          new Error(`Invalid search url: ${connectionDetails.searchUrl}`)
        );
      }

      if (maxSearchCountReached()) {
        return reject(new Error("Maximum search count exceeded"));
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
            // reconnectIsDisabled: false,
          },
        ];
      });

      return resolve();
    });
  };

  const isWebSocketStoreEmpty = () => {
    return webSocketStore.length === 0;
  };

  const importFromFile = () => {
    remote.dialog
      .showOpenDialog({
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
                this.addNewConnection({
                  searchUrl: url,
                  name,
                }).catch(addNewConnectionErr => {
                  devErrorLog(addNewConnectionErr);
                });
              }
            } catch (error) {
              devErrorLog(error);
            }
          });
        }
      })
      .catch(error => {
        devErrorLog(error);
      });
  };

  const deleteAll = () => {
    remote.dialog
      .showMessageBox({
        ...deleteAllSearchesMessageBoxOptions,
      })
      .then(response => {
        const clickedButtonIndex = response.response;
        const deleteAllSearchesConfirmed = clickedButtonIndex === 1;

        if (deleteAllSearchesConfirmed) {
          webSocketStore.forEach(connectionDetails => {
            ipcRenderer.send(ipcEvents.WS_REMOVE, connectionDetails);
          });

          setWebSocketStore([]);
        }
      });
  };

  return (
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
        onRowAdd: maxSearchCountReached()
          ? undefined
          : wsConnectionData =>
              addNewConnection(wsConnectionData).catch(err => devErrorLog(err)),
        onRowDelete: wsConnectionData =>
          deleteConnection(wsConnectionData).catch(err => devErrorLog(err)),
      }}
      actions={[
        webSocket => ({
          icon: "cached",
          tooltip: "Reconnect",
          onClick: (event, connectionDetails) => reconnect(connectionDetails),
          // disabled: webSocket.reconnectIsDisabled || allReconnectsAreDisabled,
        }),
        {
          icon: "cached",
          tooltip: "Reconnect all",
          isFreeAction: true,
          disabled: isWebSocketStoreEmpty(), // || allReconnectsAreDisabled,
          onClick: () => reconnectAll(),
        },
        {
          icon: "create_new_folder",
          tooltip: maxSearchCountReached()
            ? `Number of searches are limited to ${searchCountLimit} by GGG`
            : "Import from file",
          isFreeAction: true,
          disabled: maxSearchCountReached(),
          onClick: () => importFromFile(),
        },
        {
          icon: "delete_outline",
          tooltip: "Delete all",
          isFreeAction: true,
          onClick: () => deleteAll(),
          disabled: isWebSocketStoreEmpty(),
        },
        {
          // It's an alternative workaround to control the add icon's visibility: https://github.com/mbrn/@material-table/core/issues/465#issuecomment-482955841
          icon: "add_box",
          tooltip: `Number of searches are limited to ${searchCountLimit} by GGG`,
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
  );
};

export default Searches;
