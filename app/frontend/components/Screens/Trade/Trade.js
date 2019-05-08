import React, { Component } from "react";
import MaterialTable from "material-table";
import Store from "electron-store";
import * as TableColumns from "../../../resources/TableColumns/TableColumns";

const store = new Store();

class Trade extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: store.get("messages") || []
    };

    this.deleteMessage = this.deleteMessage.bind(this);
  }

  deleteMessage(message) {
    return new Promise(resolve => {
      const {
        messages: [...messages]
      } = this.state;

      const messageIndex = messages.indexOf(message);
      messages.splice(messageIndex, 1);

      this.setState({
        messages
      });

      store.set("messages", messages);

      resolve();
    });
  }

  render() {
    const {
      messages: [...messages]
    } = this.state;
    return (
      <MaterialTable
        title="Messages"
        columns={TableColumns.tradeScreen}
        data={messages}
        editable={{
          onRowDelete: message => this.deleteMessage(message)
        }}
      />
    );
  }
}

export default Trade;
