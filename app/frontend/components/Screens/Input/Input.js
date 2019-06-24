import React, { Component } from "react";
import { ipcRenderer } from "electron";
import MaterialTable from "material-table";
import * as tableColumns from "../../../resources/TableColumns/TableColumns";
import { ipcEvents } from "../../../../resources/IPCEvents/IPCEvents";
import { uniqueIdGenerator } from "../../../../utils/UniqueIdGenerator/UniqueIdGenerator";
import { globalStore } from "../../../../GlobalStore/GlobalStore";
import { storeKeys } from "../../../../resources/StoreKeys/StoreKeys";
import * as regExes from "../../../../resources/RegExes/RegExes";
import InvalidInputError from "../../../../errors/invalid-input-error";

class Input extends Component {
  constructor(props) {
    super(props);

    this.state = {
      webSocketStore: []
    };
  }

  componentDidMount() {
    ipcRenderer.send(ipcEvents.STORE_REQUEST);

    ipcRenderer.on(ipcEvents.STORE_UPDATE, (event, updatedStore) => {
      this.setState({
        webSocketStore: updatedStore
      });
    });
  }

  componentWillUnmount() {
    ipcRenderer.removeAllListeners();
  }

  addNewConnection = connectionDetails => {
    return new Promise((resolve, reject) => {
      if (
        !regExes.searchUrlLeagueAndIdMatcher.test(connectionDetails.searchUrl)
      ) {
        return reject(new InvalidInputError());
      }

      const connectionDetailsWithUniqueId = {
        id: uniqueIdGenerator(),
        ...connectionDetails
      };

      ipcRenderer.send(ipcEvents.WS_ADD, connectionDetailsWithUniqueId);

      const globalStoreConnections = globalStore.get(
        storeKeys.WS_CONNECTIONS,
        []
      );

      globalStoreConnections.push(connectionDetailsWithUniqueId);

      globalStore.set(storeKeys.WS_CONNECTIONS, globalStoreConnections);

      return resolve();
    });
  };

  deleteConnection = connectionDetails => {
    return new Promise(resolve => {
      ipcRenderer.send(ipcEvents.WS_REMOVE, connectionDetails);

      const globalStoreConnections = globalStore.get(
        storeKeys.WS_CONNECTIONS,
        []
      );

      const updatedGlobalStoreConnections = globalStoreConnections.filter(
        storedConnection => storedConnection.id !== connectionDetails.id
      );

      globalStore.set(storeKeys.WS_CONNECTIONS, updatedGlobalStoreConnections);

      resolve();
    });
  };

  render() {
    const {
      webSocketStore: [...webSocketStore]
    } = this.state;

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
      />
    );
  }
}

export default Input;
