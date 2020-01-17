import React from "react";
import { ipcRenderer } from "electron";
import { Box, Typography } from "@material-ui/core";
import Button from "../../UI/SimpleHtmlElements/Button/Button";
import ToggleButton from "../../UI/ToggleButton/ToggleButton";
import ResultsListLimit from "./Display/ResultsListLimit";
import { ipcEvents } from "../../../../resources/IPCEvents/IPCEvents";
import SingletonGlobalStore from "../../../../GlobalStore/GlobalStore";
import { storeKeys } from "../../../../resources/StoreKeys/StoreKeys";

const SetingsPageSection = ({ title, children }) => (
  <Box mt={2} mb={2}>
    <Typography variant="subtitle1">{title}</Typography>
    {children}
  </Box>
);

export default () => {
  const globalStore = new SingletonGlobalStore();

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
      <SetingsPageSection title="Test notification">
        <Button
          text="Send"
          clickEvent={() => ipcRenderer.send(ipcEvents.TEST_NOTIFICATION)}
        />
      </SetingsPageSection>
      <SetingsPageSection title="Copy whisper messages to the clipboard">
        <ToggleButton
          defaultState={globalStore.get(storeKeys.COPY_WHISPER, true)}
          changed={copyWhisper =>
            globalStore.set(storeKeys.COPY_WHISPER, copyWhisper)
          }
        />
      </SetingsPageSection>
      <SetingsPageSection title="Allow notifications">
        <ToggleButton
          defaultState={globalStore.get(storeKeys.SCHEDULE_RESULTS, true)}
          changed={scheduleResults =>
            handleAllowNotificationsChange(scheduleResults)
          }
        />
      </SetingsPageSection>
      <Typography variant="h6">Display</Typography>
      <SetingsPageSection title="Remember this many results">
        <ResultsListLimit />
      </SetingsPageSection>
    </Box>
  );
};
