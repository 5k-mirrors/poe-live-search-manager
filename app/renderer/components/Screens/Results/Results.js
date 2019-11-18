/* eslint-disable react/jsx-one-expression-per-line */
import React, { useState, useEffect } from "react";
import { remote, clipboard, ipcRenderer } from "electron";
import Box from "@material-ui/core/Box";
import MaterialTable from "material-table";
import { Link } from "react-router-dom";
import { ipcEvents } from "../../../../resources/IPCEvents/IPCEvents";
import { globalStore } from "../../../../GlobalStore/GlobalStore";
import { storeKeys } from "../../../../resources/StoreKeys/StoreKeys";
import * as tableColumns from "../../../resources/TableColumns/TableColumns";
import { deleteAllResults as deleteAllResultsMessageBoxOptions } from "../../../resources/MessageBoxOptions/MessageBoxOptions";
import withRouteRestriction from "../../withRouteRestriction/withRouteRestriction";

const trade = () => {
  const [results, setResults] = useState(
    globalStore.get(storeKeys.RESULTS, [])
  );

  const resultsLimit = globalStore.get(storeKeys.RESULTS_LIMIT, 100);

  useEffect(() => {
    ipcRenderer.on(ipcEvents.RESULTS_UPDATE, (_, updatedResults) => {
      setResults(updatedResults);
    });

    return () => ipcRenderer.removeAllListeners();
  }, []);

  function deleteResult(resultDetails) {
    const updatedResults = results.filter(
      result => result.id !== resultDetails.id
    );

    setResults(updatedResults);

    globalStore.set(storeKeys.RESULTS, updatedResults);
  }

  function deleteAll() {
    const clickedButtonIndex = remote.dialog.showMessageBox({
      ...deleteAllResultsMessageBoxOptions,
    });

    // Electron's doc is misleading because showMessageBox() does not return a Promise.
    // Instead, it returns the clicked button's index based on the button's array.
    // https://stackoverflow.com/questions/57839415/electron-dialog-showopendialog-not-returning-a-promise
    const deleteAllResultsConfirmed = clickedButtonIndex === 1;

    if (deleteAllResultsConfirmed) {
      setResults([]);

      globalStore.set(storeKeys.RESULTS, []);
    }
  }

  return (
    <MaterialTable
      style={{ whiteSpace: "nowrap" }}
      components={{
        Pagination: () => (
          <Box component="td" padding={2} fontSize="13px">
            Result count: <b>{results.length}</b>
            <Link to="/settings" style={{ marginLeft: 3 }}>
              (limit: <b>{resultsLimit}</b>)
            </Link>
          </Box>
        ),
      }}
      columns={tableColumns.resultsScreen}
      data={results}
      actions={[
        result => ({
          icon: "file_copy",
          tooltip: "Copy whisper",
          onClick: () => clipboard.writeText(result.whisperMessage),
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
          disabled: results.length === 0,
        },
      ]}
      options={{
        showTitle: false,
        toolbarButtonAlignment: "left",
        headerStyle: {
          position: "sticky",
          top: 0,
        },
        maxBodyHeight: "525px",
        pageSize: resultsLimit,
        emptyRowsWhenPaging: false,
      }}
    />
  );
};

export default withRouteRestriction(trade);
