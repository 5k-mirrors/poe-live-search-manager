import React, { useState, useEffect } from "react";
import { clipboard, ipcRenderer } from "electron";
import MaterialTable from "material-table";
import { ipcEvents } from "../../../../resources/IPCEvents/IPCEvents";
import { globalStore } from "../../../../GlobalStore/GlobalStore";
import { storeKeys } from "../../../../resources/StoreKeys/StoreKeys";
import * as tableColumns from "../../../resources/TableColumns/TableColumns";
import withRouteRestriction from "../../withRouteRestriction/withRouteRestriction";

const trade = () => {
  const [results, setResults] = useState(
    globalStore.get(storeKeys.RESULTS, [])
  );

  useEffect(() => {
    ipcRenderer.on(ipcEvents.RESULTS_UPDATE, (_, currentResults) => {
      setResults(currentResults);
    });

    return () => ipcRenderer.removeAllListeners();
  });

  function copyWhisper(whisper) {
    clipboard.writeText(whisper);
  }

  return (
    <MaterialTable
      style={{ whiteSpace: "nowrap" }}
      columns={tableColumns.tradeScreen}
      data={results}
      actions={[
        result => ({
          icon: "file_copy",
          tooltip: "Copy whisper",
          onClick: () => copyWhisper(result.whisperMessage),
        }),
      ]}
      options={{
        showTitle: false,
        toolbarButtonAlignment: "left",
      }}
    />
  );
};

export default withRouteRestriction(trade);
