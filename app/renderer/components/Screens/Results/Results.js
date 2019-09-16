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
    ipcRenderer.on(ipcEvents.RESULTS_UPDATE, (_, updatedResults) => {
      setResults(updatedResults);
    });

    return () => ipcRenderer.removeAllListeners();
  }, []);

  function copyWhisper(whisper) {
    clipboard.writeText(whisper);
  }

  function deleteResult(resultDetails) {
    const updatedResults = results.filter(
      result => result.id !== resultDetails.id
    );

    setResults(updatedResults);

    globalStore.set(storeKeys.RESULTS, updatedResults);
  }

  function deleteAll() {
    setResults([]);

    globalStore.set(storeKeys.RESULTS, []);
  }

  return (
    <MaterialTable
      style={{ whiteSpace: "nowrap" }}
      components={{
        Pagination: () => (
          <Box component="td" padding={2} fontSize="13px">
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
        result => ({
          icon: "delete",
          tooltip: "Delete",
          onClick: () => deleteResult(result),
        }),
        {
          icon: "delete_outline",
          tooltip: "Delete all",
          isFreeAction: true,
          onClick: () => deleteAll(),
        },
      ]}
      options={{
        showTitle: false,
        toolbarButtonAlignment: "left",
        headerStyle: {
          position: "sticky",
          top: 0,
        },
        maxBodyHeight: "500px",
        pageSize: globalStore.get(storeKeys.RESULTS_LIMIT, 100),
        emptyRowsWhenPaging: false,
      }}
    />
  );
};

export default withRouteRestriction(trade);
