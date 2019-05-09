import React, { Component } from "react";
import MaterialTable from "material-table";
import { globalStore } from "../../../../GlobalStore/GlobalStore";
import * as TableColumns from "../../../resources/TableColumns/TableColumns";

class Trade extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: globalStore.get("messages", [])
    };

    this.deleteMessage = this.deleteMessage.bind(this);
  }

  componentDidMount() {
    globalStore.onDidChange("messages", newMessages => {
      this.setState({
        messages: newMessages
      });
    });
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

      globalStore.set("messages", messages);

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
