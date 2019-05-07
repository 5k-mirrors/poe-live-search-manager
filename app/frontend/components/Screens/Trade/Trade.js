import React, { useState } from "react";
import MaterialTable from "material-table";
import * as MaterialTableColumns from "../../../resources/MaterialTableColumns/MaterialTableColumns";

const trade = () => {
  const [messages, setMessages] = useState([]);

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
