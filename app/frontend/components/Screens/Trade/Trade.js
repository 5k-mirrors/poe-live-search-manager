import React, { Component } from "react";
import MaterialTable from "material-table";
import { store } from "../../../../resources/Store/Store";
import * as TableColumns from "../../../resources/TableColumns/TableColumns";

class Trade extends Component {
  constructor(props) {
    super(props);

    // store.clear();

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
        title="Active connections"
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
