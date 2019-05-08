import React, { Component } from "react";
import MaterialTable from "material-table";
import { store } from "../../../../resources/Store/Store";
import { ipcEvents } from "../../../../resources/IPCEvents/IPCEvents";
import * as TableColumns from "../../../resources/TableColumns/TableColumns";

// https://github.com/electron/electron/issues/7300#issuecomment-274269710
const electron = window.require("electron");
const { ipcRenderer } = electron;

// TODO: messages can only be seen whenever the current path is `/trade`.
class Trade extends Component {
  constructor(props) {
    super(props);

    // store.clear();

    this.state = {
      messages: store.get("messages") || []
    };

    this.storeMessage = this.storeMessage.bind(this);
  }

  componentDidMount() {
    ipcRenderer.on(ipcEvents.ON_MESSAGE, this.storeMessage);
  }

  componentWillUnmount() {
    ipcRenderer.removeListener(ipcEvents.ON_MESSAGE, this.storeMessage);
  }

  storeMessage(_, itemData) {
    const { messages } = this.state;

    const parsedItemData = JSON.parse(itemData);

    messages.unshift(parsedItemData);

    store.set("messages", messages);

    this.setState({
      messages
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
