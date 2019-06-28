import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import { globalStore } from "../../../../../GlobalStore/GlobalStore";
import { storeKeys } from "../../../../../resources/StoreKeys/StoreKeys";

const clipboard = () => {
  const [copyWhiser, setCopyWhisper] = useState(
    globalStore.get(storeKeys.COPY_WHISPER, true)
  );

  function handleSwitchChange(copyIsEnabled) {
    setCopyWhisper(copyIsEnabled);

    globalStore.set(storeKeys.COPY_WHISPER, copyIsEnabled);
  }

  return (
    <Box mt={2}>
      <Typography variant="h6">
        Copy whisper messages to the clipboard
      </Typography>
      <Grid component="label" container alignItems="center" spacing={1}>
        <Grid item>Disabled</Grid>
        <Grid item>
          <Switch
            checked={copyWhiser}
            onChange={event => handleSwitchChange(event.target.checked)}
            color="default"
          />
        </Grid>
        <Grid item>Enabled</Grid>
      </Grid>
    </Box>
  );
};

export default clipboard;
