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

    this.onMessagesStateChange = this.onMessagesStateChange.bind(this);
    this.removeMessagesListener = globalStore.onDidChange(
      "messages",
      this.onMessagesStateChange
    );
  }

  componentWillUnmount() {
    this.removeMessagesListener();
  }

  onMessagesStateChange(updatedMessages) {
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
