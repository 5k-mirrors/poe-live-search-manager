import React, { useState } from "react";
import MaterialTable from "material-table";
import { ipcEvents } from "../../../../resources/IPCEvents/IPCEvents";
import * as MaterialTableColumns from "../../../resources/MaterialTableColumns/MaterialTableColumns";

// https://github.com/electron/electron/issues/7300#issuecomment-274269710
const electron = window.require("electron");
const { ipcRenderer } = electron;

const trade = () => {
  const [messages, setMessages] = useState([]);

  ipcRenderer.on(ipcEvents.ON_MESSAGE, (_, msg) => {
    console.log(`[Message received.] -> ${msg}`);
  });

  return (
    <MaterialTable
      title="Active connections"
      columns={MaterialTableColumns.tradeScreen}
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
