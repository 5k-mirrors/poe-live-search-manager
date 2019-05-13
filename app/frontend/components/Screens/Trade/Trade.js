import React from "react";
import MaterialTable from "material-table";
import useStoreListener from "../../../utils/useStoreListener/useStoreListener";
import withLoggedOutRedirection from "../../withLoggedOutRedirection/withLoggedOutRedirection";
import { globalStore } from "../../../../GlobalStore/GlobalStore";
import * as TableColumns from "../../../resources/TableColumns/TableColumns";

const trade = () => {
  const [messages, setMessages] = useStoreListener("messages") || [];

  function deleteMessage(message) {
    return new Promise(resolve => {
      const currentMessages = [...messages];

      const messageIndex = messages.indexOf(message);
      currentMessages.splice(messageIndex, 1);

      setMessages(currentMessages);

      globalStore.set("messages", currentMessages);

      resolve();
    });
  }

  return (
    <MaterialTable
      title="Messages"
      columns={TableColumns.tradeScreen}
      data={messages}
      editable={{
        onRowDelete: message => deleteMessage(message)
      }}
    />
  );
};

export default withLoggedOutRedirection(trade, "/account");
