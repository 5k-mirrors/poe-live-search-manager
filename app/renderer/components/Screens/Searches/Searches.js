import React, { Component } from "react";
import { remote, ipcRenderer } from "electron";
import MaterialTable from "material-table";
import Box from "@material-ui/core/Box";
import yaml from "js-yaml";
import fs from "fs";
import Snackbar from "@material-ui/core/Snackbar";
import * as tableColumns from "../../../resources/TableColumns/TableColumns";
import { ipcEvents } from "../../../../resources/IPCEvents/IPCEvents";
import { uniqueIdGenerator } from "../../../../utils/UniqueIdGenerator/UniqueIdGenerator";
import * as regExes from "../../../../resources/RegExes/RegExes";
import * as javaScriptUtils from "../../../../utils/JavaScriptUtils/JavaScriptUtils";
import { deleteAllSearches as deleteAllSearchesMessageBoxOptions } from "../../../resources/MessageBoxOptions/MessageBoxOptions";
import InvalidInputError from "../../../../errors/invalid-input-error";

export default class Searches extends Component {
  constructor(props) {
    super(props);

    this.state = {
      importErrorOpen: false,
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

  update(id, data) {
    const {
      webSocketStore: [...webSocketStore],
    } = this.state;

    const webSocketIndex = webSocketStore.findIndex(
      webSocket => webSocket.id === id
    );

    if (javaScriptUtils.isDefined(webSocketStore[webSocketIndex])) {
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
        return reject(new InvalidInputError());
      }

      const {
        webSocketStore: [...webSocketStore],
      } = this.state;

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
                });
              }
            } catch (e) {
              javaScriptUtils.devErrorLog(e);
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
    } = this.state;

    return (
      <>
        <Snackbar
          open={importErrorOpen}
          autoHideDuration={4000}
          message="Invalid YAML format"
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          onClose={this.handleImportErrorClose}
        />
        <MaterialTable
          title="Active connections"
          columns={tableColumns.searchesScreen}
          components={{
            Pagination: () => (
              <Box component="td" padding={2} fontSize="13px">
                {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
                Search count: <b>{webSocketStore.length}</b>
              </Box>
            ),
          }}
          data={webSocketStore}
          editable={{
            onRowAdd: wsConnectionData =>
              this.addNewConnection(wsConnectionData),
            onRowDelete: wsConnectionData =>
              this.deleteConnection(wsConnectionData),
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
