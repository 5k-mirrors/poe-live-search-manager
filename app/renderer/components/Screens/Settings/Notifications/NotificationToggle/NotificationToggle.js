import React from "react";
import { ipcRenderer } from "electron";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import ToggleButton from "../../../../UI/ToggleButton/ToggleButton";
import { globalStore } from "../../../../../../GlobalStore/GlobalStore";
import { storeKeys } from "../../../../../../resources/StoreKeys/StoreKeys";
import { ipcEvents } from "../../../../../../resources/IPCEvents/IPCEvents";

const notificationToggle = () => {
  function handleChange(scheduleResults) {
    globalStore.set(storeKeys.SCHEDULE_RESULTS, scheduleResults);

    const dropScheduledResults = scheduleResults === false;

    if (dropScheduledResults) {
      ipcRenderer.send(ipcEvents.DROP_SCHEDULED_RESULTS);
    }
  }

  return (
    <Box mt={2} mb={2}>
      <Typography variant="subtitle1">Allow notifications</Typography>
      <ToggleButton
        defaultState={globalStore.get(storeKeys.SCHEDULE_RESULTS, true)}
        changed={scheduleResults => handleChange(scheduleResults)}
      />
    </Box>
  );
};

export default notificationToggle;
