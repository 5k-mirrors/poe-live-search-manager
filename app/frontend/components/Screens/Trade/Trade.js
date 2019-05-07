import React, { useState } from "react";
import MaterialTable from "material-table";
import { ipcEvents } from "../../../../resources/IPCEvents/IPCEvents";
import * as TableColumns from "../../../resources/TableColumns/TableColumns";

// https://github.com/electron/electron/issues/7300#issuecomment-274269710
const electron = window.require("electron");
const { ipcRenderer } = electron;

const trade = () => {
  const [messages, setMessages] = useState([]);

  ipcRenderer.on(ipcEvents.ON_MESSAGE, (_, itemData) => {
    const parsedData = JSON.parse(itemData);

    const currentMessages = [...messages];

    currentMessages.push(parsedData);

    setMessages(currentMessages);
  });

  return (
    <MaterialTable
      title="Active connections"
      columns={TableColumns.tradeScreen}
      data={messages}
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
  );
};

export default trade;
