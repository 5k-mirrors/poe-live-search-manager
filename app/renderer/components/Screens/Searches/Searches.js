import React, { Component } from "react";
import { remote, ipcRenderer } from "electron";
import MaterialTable from "material-table";
import { Box, Typography, Snackbar } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import yaml from "js-yaml";
import fs from "fs";
import * as tableColumns from "../../../resources/TableColumns/TableColumns";
import { ipcEvents } from "../../../../resources/IPCEvents/IPCEvents";
import { uniqueIdGenerator } from "../../../../utils/UniqueIdGenerator/UniqueIdGenerator";
import * as regExes from "../../../../resources/RegExes/RegExes";
import {
  devErrorLog,
  isDefined,
} from "../../../../utils/JavaScriptUtils/JavaScriptUtils";
import { deleteAllSearches as deleteAllSearchesMessageBoxOptions } from "../../../resources/MessageBoxOptions/MessageBoxOptions";

export default class Searches extends Component {
  constructor(props) {
    super(props);

    this.state = {
      importErrorOpen: false,
      maxSearchCountExceededErrorOpen: false,
      webSocketStore: [],
      allReconnectsAreDisabled: false,
    };

    this.reconnectTimeoutIds = [];
    this.disableDurationInMilliseconds = 2000;
  }

  componentDidMount() {
    ipcRenderer.send(ipcEvents.GET_SOCKETS);

    ipcRenderer.on(ipcEvents.SEND_SOCKETS, this.sendSocketsListener);

    ipcRenderer.on(
      ipcEvents.SOCKET_STATE_UPDATE,
      this.socketStateUpdateListener
    );
  }

  componentWillUnmount() {
    ipcRenderer.removeListener(
      ipcEvents.SEND_SOCKETS,
      this.sendSocketsListener
    );

    ipcRenderer.removeListener(
      ipcEvents.SOCKET_STATE_UPDATE,
      this.socketStateUpdateListener
    );

    this.reconnectTimeoutIds.forEach(timeout => {
      clearTimeout(timeout);
    });
  }

  sendSocketsListener = (event, currentSockets) => {
    this.setState({
      webSocketStore: currentSockets,
    });
  };

  socketStateUpdateListener = (event, socketDetails) => {
    if (this.stateHasChanged(socketDetails.id, socketDetails.isConnected)) {
      this.update(socketDetails.id, {
        isConnected: socketDetails.isConnected,
      });
    }
  };

  reconnect = connectionDetails => {
    this.disableReconnect(connectionDetails.id);

    ipcRenderer.send(ipcEvents.RECONNECT_SOCKET, connectionDetails);
  };

  reconnectAll = () => {
    this.disableAllReconnects();

    ipcRenderer.send(ipcEvents.RECONNECT_ALL);
  };

  stateHasChanged = (id, isConnected) => {
    const {
      webSocketStore: [...webSocketStore],
    } = this.state;

    const searchEl = webSocketStore.find(el => el.id === id);

    return searchEl && searchEl.isConnected !== isConnected;
  };

  handleImportErrorClose = () => {
    this.setState({
      importErrorOpen: false,
    });
  };

  handleMaxSearchCountExceededErrorClose = () => {
    this.setState({
      maxSearchCountExceededErrorOpen: false,
    });
  };

  update(id, data) {
    const {
      webSocketStore: [...webSocketStore],
    } = this.state;

    const webSocketIndex = webSocketStore.findIndex(
      webSocket => webSocket.id === id
    );

    if (isDefined(webSocketStore[webSocketIndex])) {
      webSocketStore[webSocketIndex] = {
        ...webSocketStore[webSocketIndex],
        ...data,
      };

      this.setState({
        webSocketStore,
      });
    }
  }

  disableReconnect(id) {
    this.update(id, {
      reconnectIsDisabled: true,
    });

    this.reconnectTimeoutIds.push(
      setTimeout(() => {
        this.update(id, { reconnectIsDisabled: false });
      }, this.disableDurationInMilliseconds)
    );
  }

  disableAllReconnects() {
    this.setState({
      allReconnectsAreDisabled: true,
    });

    this.reconnectTimeoutIds.push(
      setTimeout(() => {
        this.setState({
          allReconnectsAreDisabled: false,
        });
      }, this.disableDurationInMilliseconds)
    );
  }

  deleteConnection(connectionDetails) {
    return new Promise(resolve => {
      const {
        webSocketStore: [...webSocketStore],
      } = this.state;

      const updatedWebSocketStore = webSocketStore.filter(
        webSocket => webSocket.id !== connectionDetails.id
      );

      ipcRenderer.send(ipcEvents.WS_REMOVE, connectionDetails);

      this.setState({
        webSocketStore: updatedWebSocketStore,
      });

      resolve();
    });
  }

  addNewConnection(connectionDetails) {
    return new Promise((resolve, reject) => {
      if (
        !regExes.searchUrlLeagueAndIdMatcher.test(connectionDetails.searchUrl)
      ) {
        return reject(
          new Error(`Invalid search url: ${connectionDetails.searchUrl}`)
        );
      }

      const {
        webSocketStore: [...webSocketStore],
      } = this.state;

      if (this.maxSearchCountReached()) {
        this.setState({
          maxSearchCountExceededErrorOpen: true,
        });

        return reject(new Error("Maximum search count exceeded"));
      }

      const connectionDetailsWithUniqueId = {
        id: uniqueIdGenerator(),
        ...connectionDetails,
      };

      ipcRenderer.send(ipcEvents.WS_ADD, connectionDetailsWithUniqueId);

      webSocketStore.push({
        ...connectionDetailsWithUniqueId,
        reconnectIsDisabled: false,
      });

      this.setState({
        webSocketStore,
      });

      return resolve();
    });
  }

  isWebSocketStoreEmpty() {
    const {
      webSocketStore: [...webSocketStore],
    } = this.state;

    return webSocketStore.length === 0;
  }

  maxSearchCountReached() {
    const {
      webSocketStore: [...webSocketStore],
    } = this.state;

    return webSocketStore.length === 20;
  }

  import() {
    remote.dialog.showOpenDialog(
      {
        properties: ["openFile"],
        filters: [{ name: "YAML", extensions: ["yml", "yaml"] }],
      },
      files => {
        if (files) {
          fs.readFile(files[0], "utf8", (err, data) => {
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
            } catch (e) {
              devErrorLog(e);
              this.setState({
                importErrorOpen: true,
              });
            }
          });
        }
      }
    );
  }

  // Electron's doc is misleading because showMessageBox() does not return a Promise.
  // Instead, it returns the clicked button's index based on the button's array.
  // https://stackoverflow.com/questions/57839415/electron-dialog-showopendialog-not-returning-a-promise
  deleteAll() {
    const clickedButtonIndex = remote.dialog.showMessageBox({
      ...deleteAllSearchesMessageBoxOptions,
    });

    const deleteAllSearchesConfirmed = clickedButtonIndex === 1;

    if (deleteAllSearchesConfirmed) {
      const {
        webSocketStore: [...webSocketStore],
      } = this.state;

      webSocketStore.forEach(connectionDetails => {
        ipcRenderer.send(ipcEvents.WS_REMOVE, connectionDetails);
      });

      this.setState({
        webSocketStore: [],
      });
    }
  }

  render() {
    const {
      webSocketStore: [...webSocketStore],
      allReconnectsAreDisabled,
      importErrorOpen,
      maxSearchCountExceededErrorOpen,
    } = this.state;

    return (
      <>
        <Snackbar
          open={importErrorOpen}
          autoHideDuration={4000}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          onClose={this.handleImportErrorClose}
        >
          <Alert
            severity="error"
            variant="filled"
            onClose={this.handleImportErrorClose}
          >
            Invalid YAML format
          </Alert>
        </Snackbar>
        <Snackbar
          open={maxSearchCountExceededErrorOpen}
          autoHideDuration={4000}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          onClose={this.handleMaxSearchCountExceededErrorClose}
        >
          <Alert
            severity="error"
            variant="filled"
            onClose={this.handleMaxSearchCountExceededErrorClose}
          >
            Cannot exceed maximum search count(20)
          </Alert>
        </Snackbar>
        <MaterialTable
          title="Active connections"
          columns={tableColumns.searchesScreen}
          components={{
            Pagination: () => (
              <Box component="td" padding={2}>
                <Typography
                  color={webSocketStore.length === 20 ? "error" : "initial"}
                  variant="subtitle2"
                >
                  {`Search count: ${webSocketStore.length}`}
                </Typography>
              </Box>
            ),
          }}
          data={webSocketStore}
          editable={{
            // It's an alternative workaround to control the add icon's visibility: https://github.com/mbrn/material-table/issues/465#issuecomment-482955841
            onRowAdd: this.maxSearchCountReached()
              ? undefined
              : wsConnectionData =>
                  this.addNewConnection(wsConnectionData).catch(err =>
                    devErrorLog(err)
                  ),
            onRowDelete: wsConnectionData =>
              this.deleteConnection(wsConnectionData).catch(err =>
                devErrorLog(err)
              ),
          }}
          actions={[
            webSocket => ({
              icon: "cached",
              tooltip: "Reconnect",
              onClick: (event, connectionDetails) =>
                this.reconnect(connectionDetails),
              disabled:
                webSocket.reconnectIsDisabled || allReconnectsAreDisabled,
            }),
            {
              icon: "cached",
              tooltip: "Reconnect all",
              isFreeAction: true,
              disabled:
                this.isWebSocketStoreEmpty() || allReconnectsAreDisabled,
              onClick: () => this.reconnectAll(),
            },
            {
              icon: "create_new_folder",
              tooltip: "Import from file",
              isFreeAction: true,
              onClick: () => this.import(),
            },
            {
              icon: "delete_outline",
              tooltip: "Delete all",
              isFreeAction: true,
              onClick: () => this.deleteAll(),
              disabled: this.isWebSocketStoreEmpty(),
            },
            {
              // It's an alternative workaround to control the add icon's visibility: https://github.com/mbrn/material-table/issues/465#issuecomment-482955841
              icon: "add_box",
              tooltip: "Search count cannot go over 20",
              isFreeAction: true,
              disabled: true,
              hidden: !this.maxSearchCountReached(),
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
      </>
    );
  }
}
