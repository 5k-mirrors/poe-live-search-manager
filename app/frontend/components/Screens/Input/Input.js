import React, { Component } from "react";
import MaterialTable from "material-table";
import * as TableColumns from "../../../resources/TableColumns/TableColumns";
import { ipcEvents } from "../../../../resources/IPCEvents/IPCEvents";
import { uniqueIdGenerator } from "../../../utils/UniqueIdGenerator/UniqueIdGenerator";
import { globalStore } from "../../../../GlobalStore/GlobalStore";

// https://github.com/electron/electron/issues/7300#issuecomment-274269710
const electron = window.require("electron");
const { ipcRenderer } = electron;

class Input extends Component {
  constructor(props) {
    super(props);

    this.state = {
      wsConnections: globalStore.get("wsConnections", [])
    };
  }

  addNewConnection(wsConnectionData) {
    return new Promise(resolve => {
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

      globalStore.set("wsConnections", wsConnections);

      ipcRenderer.send(ipcEvents.WS_ADD, {
        ...wsConnectionDataWithUniqueId
      });

      resolve();
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

      globalStore.set("wsConnections", wsConnections);

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

      globalStore.set("wsConnections", wsConnections);

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
        columns={TableColumns.inputScreen}
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
