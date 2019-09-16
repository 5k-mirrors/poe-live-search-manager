import React, { useState, useEffect } from "react";
import { clipboard, ipcRenderer } from "electron";
import Box from "@material-ui/core/Box";
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
  }, []);

  function copyWhisper(whisper) {
    clipboard.writeText(whisper);
  }

  return (
    <MaterialTable
      style={{ whiteSpace: "nowrap" }}
      components={{
        Pagination: () => (
          <Box component="td" padding={2} fontSize="13px" width="100%">
            {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
            Results count: <b>{results.length}</b>
          </Box>
        ),
      }}
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
        headerStyle: {
          position: "sticky",
          top: 0,
        },
        maxBodyHeight: "500px",
        pageSize: Number(globalStore.get(storeKeys.RESULTS_LIMIT, 100)),
        emptyRowsWhenPaging: false,
      }}
    />
  );
};

export default withRouteRestriction(trade);
