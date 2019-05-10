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

    this.onMessagesChange = this.onMessagesChange.bind(this);
    this.removeMessagesListener = globalStore.onDidChange(
      "messages",
      this.onMessagesChange
    );
  }

  componentWillUnmount() {
    this.removeMessagesListener();
  }

  onMessagesChange(updatedMessages) {
    this.setState({
      messages: updatedMessages
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
      />
    );
  }
}

export default Trade;
