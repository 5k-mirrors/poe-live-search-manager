import React, { Component } from "react";
import { ipcRenderer } from "electron";
import MaterialTable from "material-table";
import * as tableColumns from "../../../resources/TableColumns/TableColumns";
import { ipcEvents } from "../../../../resources/IPCEvents/IPCEvents";
import { uniqueIdGenerator } from "../../../../utils/UniqueIdGenerator/UniqueIdGenerator";
import * as regExes from "../../../../resources/RegExes/RegExes";
import * as javaScriptUtils from "../../../../utils/JavaScriptUtils/JavaScriptUtils";
import InvalidInputError from "../../../../errors/invalid-input-error";
import withRouteRestriction from "../../withRouteRestriction/withRouteRestriction";

class Searches extends Component {
  constructor(props) {
    super(props);

    this.state = {
      webSocketStore: [],
      allReconnectsAreDisabled: false,
    };

    this.reconnectTimeoutIds = [];
    this.disableDurationInMilliseconds = 2000;
  }

  componentDidMount() {
    ipcRenderer.send(ipcEvents.GET_SOCKETS);

    ipcRenderer.on(ipcEvents.SEND_SOCKETS, (event, currentSockets) => {
      this.setState({
        webSocketStore: currentSockets,
      });
    });

    ipcRenderer.on(ipcEvents.SOCKET_STATE_UPDATE, (event, socketDetails) => {
      if (this.stateHasChanged(socketDetails.id, socketDetails.isConnected)) {
        this.update(socketDetails.id, {
          isConnected: socketDetails.isConnected,
        });
      }
    });
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners();

    this.reconnectTimeoutIds.forEach(timeout => {
      clearTimeout(timeout);
    });
  }

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

  deleteAll() {
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

  render() {
    const {
      webSocketStore: [...webSocketStore],
      allReconnectsAreDisabled,
    } = this.state;

    return (
      <MaterialTable
        title="Active connections"
        columns={tableColumns.inputScreen}
        data={webSocketStore}
        editable={{
          onRowAdd: wsConnectionData => this.addNewConnection(wsConnectionData),
          onRowDelete: wsConnectionData =>
            this.deleteConnection(wsConnectionData),
        }}
        actions={[
          webSocket => ({
            icon: "cached",
            tooltip: "Reconnect",
            onClick: (event, connectionDetails) =>
              this.reconnect(connectionDetails),
            disabled: webSocket.reconnectIsDisabled || allReconnectsAreDisabled,
          }),
          {
            icon: "cached",
            tooltip: "Reconnect all",
            isFreeAction: true,
            disabled: this.isWebSocketStoreEmpty() || allReconnectsAreDisabled,
            onClick: () => this.reconnectAll(),
          },
          {
            icon: "delete_outline",
            tooltip: "Delete all",
            isFreeAction: true,
            onClick: () => this.deleteAll(),
          },
        ]}
        options={{
          showTitle: false,
          toolbarButtonAlignment: "left",
        }}
      />
    );
  }
}

export default withRouteRestriction(Searches);
