import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { ipcRenderer } from "electron";
import Button from "../../../../UI/SimpleHtmlElements/Button/Button";
import { ipcEvents } from "../../../../../../resources/IPCEvents/IPCEvents";

const testNotification = () => {
  function send() {
    ipcRenderer.send(ipcEvents.TEST_NOTIFICATION);
  }

  return (
    <Box mt={2} mb={2}>
      <Typography variant="subtitle1">Test notification</Typography>
      <Button text="Send" clickEvent={send} />
    </Box>
  );
};

export default testNotification;
