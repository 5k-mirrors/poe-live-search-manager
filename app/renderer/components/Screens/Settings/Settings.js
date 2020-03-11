import React from "react";
import { ipcRenderer } from "electron";
import { Box, Typography } from "@material-ui/core";
import Button from "../../UI/SimpleHtmlElements/Button/Button";
import ToggleButton from "../../UI/ToggleButton/ToggleButton";
import ResultsListLimit from "./Display/ResultsListLimit";
import { ipcEvents } from "../../../../resources/IPCEvents/IPCEvents";
import GlobalStore from "../../../../GlobalStore/GlobalStore";
import { storeKeys } from "../../../../resources/StoreKeys/StoreKeys";

const SettingsPageSection = ({ title, children }) => (
  <Box mt={2} mb={2}>
    <Typography variant="subtitle1">{title}</Typography>
    {children}
  </Box>
);

export default () => {
  const globalStore = GlobalStore.getInstance();

  function handleAllowNotificationsChange(scheduleResults) {
    globalStore.set(storeKeys.SCHEDULE_RESULTS, scheduleResults);

    const dropScheduledResults = scheduleResults === false;

    if (dropScheduledResults) {
      ipcRenderer.send(ipcEvents.DROP_SCHEDULED_RESULTS);
    }
  }

  return (
    <Box>
      <Typography variant="h6">Notifications</Typography>
      <SettingsPageSection title="Test notification">
        <Button
          text="Send"
          clickEvent={() => ipcRenderer.send(ipcEvents.TEST_NOTIFICATION)}
        />
      </SettingsPageSection>
      <SettingsPageSection title="Copy whisper messages to the clipboard">
        <ToggleButton
          defaultState={globalStore.get(storeKeys.COPY_WHISPER, true)}
          changed={copyWhisper =>
            globalStore.set(storeKeys.COPY_WHISPER, copyWhisper)
          }
        />
      </SettingsPageSection>
      <SettingsPageSection title="Allow notifications">
        <ToggleButton
          defaultState={globalStore.get(storeKeys.SCHEDULE_RESULTS, true)}
          changed={scheduleResults =>
            handleAllowNotificationsChange(scheduleResults)
          }
        />
      </SettingsPageSection>
      <Typography variant="h6">Display</Typography>
      <SettingsPageSection title="Remember this many results">
        <ResultsListLimit />
      </SettingsPageSection>
    </Box>
  );
};
