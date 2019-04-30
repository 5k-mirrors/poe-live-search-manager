import React, { Component } from "react";
import MaterialTable from "material-table";
import WsTableColumns from "../../resources/WsTableColumns/WsTableColumns";

class WsTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      wsConnections: []
    };
  }

  addItem(itemData) {
    return new Promise(resolve => {
      const {
        wsConnections: [...wsConnections]
      } = this.state;

      wsConnections.push(itemData);

      this.setState({
        wsConnections
      });

      resolve();
    });
  }

  updateItem(updatedItemData, previousItemData) {
    return new Promise(resolve => {
      const {
        wsConnections: [...wsConnections]
      } = this.state;

      const previousItemDataIndex = wsConnections.indexOf(previousItemData);
      wsConnections[previousItemDataIndex] = {
        ...updatedItemData
      };

      this.setState({
        wsConnections
      });

      resolve();
    });
  }

  deleteItem(itemData) {
    return new Promise(resolve => {
      const {
        wsConnections: [...wsConnections]
      } = this.state;

      const itemDataIndex = wsConnections.indexOf(itemData);
      wsConnections.splice(itemDataIndex, 1);

      this.setState({
        wsConnections
      });

      resolve();
    });
  }

  render() {
    const {
      wsConnections: [...wsConnections]
    } = this.state;

    return (
      <MaterialTable
        title="Connected WebSockets"
        columns={WsTableColumns}
        data={wsConnections}
        editable={{
          onRowAdd: itemData => this.addItem(itemData),
          onRowUpdate: (updatedItemData, previousItemData) =>
            this.updateItem(updatedItemData, previousItemData),
          onRowDelete: itemData => this.deleteItem(itemData)
        }}
        options={{
          rowStyle: {
            backgroundColor: "#EEE"
          }
        }}
      />
    );
  }
}

export default WsTable;
