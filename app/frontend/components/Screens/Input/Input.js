import React, { Component } from "react";
import MaterialTable from "material-table";
import * as tableColumns from "../../../resources/TableColumns/TableColumns";
import { ipcEvents } from "../../../../resources/IPCEvents/IPCEvents";
import { uniqueIdGenerator } from "../../../utils/UniqueIdGenerator/UniqueIdGenerator";
import { globalStore } from "../../../../GlobalStore/GlobalStore";
import { storeKeys } from "../../../../resources/StoreKeys/StoreKeys";
import * as poeUtils from "../../../../utils/PoeUtils/PoeUtils";

// https://github.com/electron/electron/issues/7300#issuecomment-274269710
const electron = window.require("electron");
const { ipcRenderer } = electron;

class Input extends Component {
  constructor(props) {
    super(props);

    this.state = {
      wsConnections: globalStore.get(storeKeys.WS_CONNECTIONS, [])
    };
  }

  addNewConnection(wsConnectionData) {
    return new Promise((resolve, reject) => {
      if (!poeUtils.urlIsValid(wsConnectionData.uri)) {
        return reject();
      }

      const {
        wsConnections: [...wsConnections]
      } = this.state;

      const wsConnectionDataWithUniqueId = {
        id: uniqueIdGenerator(),
        ...wsConnectionData
      };

      wsConnections.push(wsConnectionDataWithUniqueId);

      this.setState({
        wsConnections
      });

      globalStore.set(storeKeys.WS_CONNECTIONS, wsConnections);

      ipcRenderer.send(ipcEvents.WS_ADD, {
        ...wsConnectionDataWithUniqueId
      });

      return resolve();
    });
  }

  updateConnection(updatedWsConnectionData, previousWsConnectionData) {
    return new Promise(resolve => {
      const {
        wsConnections: [...wsConnections]
      } = this.state;

      const previousWsConnectionIndex = wsConnections.indexOf(
        previousWsConnectionData
      );
      wsConnections[previousWsConnectionIndex] = {
        ...previousWsConnectionData,
        ...updatedWsConnectionData
      };

      this.setState({
        wsConnections
      });

      globalStore.set(storeKeys.WS_CONNECTIONS, wsConnections);

      resolve();
    });
  }

  deleteConnection(wsConnectionData) {
    return new Promise(resolve => {
      const {
        wsConnections: [...wsConnections]
      } = this.state;

      const wsConnectionDataIndex = wsConnections.indexOf(wsConnectionData);
      wsConnections.splice(wsConnectionDataIndex, 1);

      this.setState({
        wsConnections
      });

      globalStore.set(storeKeys.WS_CONNECTIONS, wsConnections);

      ipcRenderer.send(ipcEvents.WS_REMOVE, wsConnectionData);

      resolve();
    });
  }

  render() {
    const {
      wsConnections: [...wsConnections]
    } = this.state;

    return (
      <MaterialTable
        title="Active connections"
        columns={tableColumns.inputScreen}
        data={wsConnections}
        editable={{
          onRowAdd: wsConnectionData => this.addNewConnection(wsConnectionData),
          onRowDelete: wsConnectionData =>
            this.deleteConnection(wsConnectionData)
        }}
        options={{
          headerStyle: {
            backgroundColor: "#01579b",
            color: "#FFF",
            fontWeight: "bold"
          },
          rowStyle: {
            backgroundColor: "#EEE"
          }
        }}
      />
    );
  }
}

export default Input;
