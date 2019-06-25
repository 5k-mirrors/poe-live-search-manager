import React, { useState, useEffect } from "react";
import { ipcRenderer } from "electron";
import MaterialTable from "material-table";
import * as tableColumns from "../../../resources/TableColumns/TableColumns";
import { ipcEvents } from "../../../../resources/IPCEvents/IPCEvents";
import { uniqueIdGenerator } from "../../../../utils/UniqueIdGenerator/UniqueIdGenerator";
import * as regExes from "../../../../resources/RegExes/RegExes";
import * as javaScriptUtils from "../../../../utils/JavaScriptUtils/JavaScriptUtils";
import * as customHooks from "../../../utils/CustomHooks/CustomHooks";
import InvalidInputError from "../../../../errors/invalid-input-error";

const input = () => {
  const [webSocketStore, setWebSocketStore] = useState([]);
  const [reconnectIsDisabled, disableReconnect] = customHooks.useDisable(2);

  const updateConnectionState = socketDetails => {
    const currentWebSocketStore = [...webSocketStore];

    const webSocketIndex = currentWebSocketStore.findIndex(
      webSocket => webSocket.id === socketDetails.id
    );

    if (javaScriptUtils.isDefined(webSocketStore[webSocketIndex])) {
      webSocketStore[webSocketIndex].isConnected = socketDetails.isConnected;
      setWebSocketStore(currentWebSocketStore);
    }
  };

  useEffect(() => {
    ipcRenderer.send(ipcEvents.STORE_REQUEST);

    ipcRenderer.on(ipcEvents.STORE_RESPONSE, (event, currentStore) => {
      setWebSocketStore(currentStore);
    });

    ipcRenderer.on(ipcEvents.SOCKET_STATE_UPDATE, (event, socketDetails) => {
      updateConnectionState(socketDetails);
    });

    return () => ipcRenderer.removeAllListeners();
  });

  const socketReconnect = connectionDetails => {
    disableReconnect();

    ipcRenderer.send(ipcEvents.SOCKET_RECONNECT, connectionDetails);
  };

  const deleteConnection = connectionDetails => {
    return new Promise(resolve => {
      const currentWebSocketStore = [...webSocketStore];

      const updatedWebSocketStore = currentWebSocketStore.filter(
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
        return reject(new InvalidInputError());
      }

      const currentWebSocketStore = [...webSocketStore];

      const connectionDetailsWithUniqueId = {
        id: uniqueIdGenerator(),
        isConnected: false,
        ...connectionDetails
      };

      ipcRenderer.send(ipcEvents.WS_ADD, connectionDetailsWithUniqueId);

      currentWebSocketStore.push(connectionDetailsWithUniqueId);

      setWebSocketStore(currentWebSocketStore);

      return resolve();
    });
  };

  return (
    <MaterialTable
      title="Active connections"
      columns={tableColumns.inputScreen}
      data={webSocketStore}
      editable={{
        onRowAdd: wsConnectionData => addNewConnection(wsConnectionData),
        onRowDelete: wsConnectionData => deleteConnection(wsConnectionData)
      }}
      actions={[
        {
          icon: "cached",
          tooltip: "Reconnect",
          onClick: (event, connectionDetails) =>
            socketReconnect(connectionDetails),
          disabled: reconnectIsDisabled
        }
      ]}
    />
  );
};

export default input;

/* class Input extends Component {
  constructor(props) {
    super(props);

    this.state = {
      webSocketStore: []
    };
  }

  componentDidMount() {
    ipcRenderer.send(ipcEvents.STORE_REQUEST);

    ipcRenderer.on(ipcEvents.STORE_RESPONSE, (event, currentStore) => {
      this.setState({
        webSocketStore: currentStore
      });
    });

    ipcRenderer.on(ipcEvents.SOCKET_STATE_UPDATE, (event, socketDetails) => {
      this.updateConnectionState(socketDetails);
    });
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners();
  }

  socketReconnect = connectionDetails => {
    ipcRenderer.send(ipcEvents.SOCKET_RECONNECT, connectionDetails);
  };

  updateConnectionState(socketDetails) {
    const {
      webSocketStore: [...webSocketStore]
    } = this.state;

    const webSocketIndex = webSocketStore.findIndex(
      webSocket => webSocket.id === socketDetails.id
    );

    if (javaScriptUtils.isDefined(webSocketStore[webSocketIndex])) {
      webSocketStore[webSocketIndex].isConnected = socketDetails.isConnected;

      this.setState({
        webSocketStore
      });
    }
  }

  deleteConnection(connectionDetails) {
    return new Promise(resolve => {
      const {
        webSocketStore: [...webSocketStore]
      } = this.state;

      const updatedWebSocketStore = webSocketStore.filter(
        webSocket => webSocket.id !== connectionDetails.id
      );

      ipcRenderer.send(ipcEvents.WS_REMOVE, connectionDetails);

      this.setState({
        webSocketStore: updatedWebSocketStore
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
        webSocketStore: [...webSocketStore]
      } = this.state;

      const connectionDetailsWithUniqueId = {
        id: uniqueIdGenerator(),
        isConnected: false,
        ...connectionDetails
      };

      ipcRenderer.send(ipcEvents.WS_ADD, connectionDetailsWithUniqueId);

      webSocketStore.push(connectionDetailsWithUniqueId);

      this.setState({
        webSocketStore
      });

      return resolve();
    });
  }

  render() {
    const {
      webSocketStore: [...webSocketStore]
    } = this.state;

    // @TODO: disable the refresh button.
    return (
      <MaterialTable
        title="Active connections"
        columns={tableColumns.inputScreen}
        data={webSocketStore}
        editable={{
          onRowAdd: wsConnectionData => this.addNewConnection(wsConnectionData),
          onRowDelete: wsConnectionData =>
            this.deleteConnection(wsConnectionData)
        }}
        actions={[
          {
            icon: "cached",
            tooltip: "Reconnect",
            onClick: (event, connectionDetails) =>
              this.socketReconnect(connectionDetails)
          }
        ]}
      />
    );
  }
}

export default Input; */
