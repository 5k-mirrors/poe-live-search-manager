import React, { Component } from "react";
import MaterialTable from "material-table";
import withStoreListener from "../../../hoc/withStoreListener/withStoreListener";
import { globalStore } from "../../../../GlobalStore/GlobalStore";
import * as TableColumns from "../../../resources/TableColumns/TableColumns";

class Trade extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: globalStore.get("messages", [])
    };
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

export default withStoreListener(Trade, "messages", "messages");
