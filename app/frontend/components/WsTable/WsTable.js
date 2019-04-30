import React, { Component } from "react";
import MaterialTable from "material-table";
import WsTableColumns from "../../resources/WsTableColumns/WsTableColumns";
import { ipcEvents } from "../../../resources/IPCEvents/IPCEvents";
import { uniqueIdGenerator } from "../../utils/UniqueIdGenerator/UniqueIdGenerator";

// https://github.com/electron/electron/issues/7300#issuecomment-274269710
const electron = window.require("electron");
const { ipcRenderer } = electron;

class WsTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      wsConnections: []
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

      ipcRenderer.send(ipcEvents.WS_CONNECT, {
        ...wsConnectionDataWithUniqueId,
        POESESSID: localStorage.getItem("poeSessionId")
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
          title="Connected WebSockets"
          columns={WsTableColumns}
          data={wsConnections}
          editable={{
            onRowAdd: wsConnectionData =>
              this.addNewConnection(wsConnectionData),
            onRowUpdate: (updatedWsConnectionData, previousWsConnectionData) =>
              this.updateConnection(
                updatedWsConnectionData,
                previousWsConnectionData
              ),
            onRowDelete: wsConnectionData =>
              this.deleteConnection(wsConnectionData)
          }}
          options={{
            rowStyle: {
              backgroundColor: "#EEE"
            }
          }}
        />
      </div>
    );
  }
}

export default WsTable;
