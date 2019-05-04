import React, { Component } from "react";
import MaterialTable from "material-table";
import Store from "electron-store";
import WsTableColumns from "../../../resources/WsTableColumns/WsTableColumns";
import { ipcEvents } from "../../../../resources/IPCEvents/IPCEvents";
import { uniqueIdGenerator } from "../../../utils/UniqueIdGenerator/UniqueIdGenerator";

// https://github.com/electron/electron/issues/7300#issuecomment-274269710
const electron = window.require("electron");
const { ipcRenderer } = electron;

class Input extends Component {
  constructor(props) {
    super(props);

    this.store = new Store();

    this.state = {
      wsConnections: this.store.get("wsConnections") || []
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

      this.store.set("wsConnections", wsConnections);

      ipcRenderer.send(ipcEvents.WS_CONNECT, {
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

      this.store.set("wsConnections", wsConnections);

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

      this.store.set("wsConnections", wsConnections);

      ipcRenderer.send(ipcEvents.WS_DISCONNECT, wsConnectionData);

      resolve();
    });
  }

  render() {
    const {
      wsConnections: [...wsConnections]
    } = this.state;

    return (
      <div>
        <MaterialTable
          title="Active connections"
          columns={WsTableColumns}
          data={wsConnections}
          editable={{
            onRowAdd: wsConnectionData =>
              this.addNewConnection(wsConnectionData),
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
      </div>
    );
  }
}

export default Input;
