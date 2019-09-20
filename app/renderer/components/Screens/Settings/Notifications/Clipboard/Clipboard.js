import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Switch from "@material-ui/core/Switch";
import { globalStore } from "../../../../../../GlobalStore/GlobalStore";
import { storeKeys } from "../../../../../../resources/StoreKeys/StoreKeys";
import { useClipboardStyles } from "./Clipboard.style";

const clipboard = () => {
  const classes = useClipboardStyles();

  const [copyWhisper, setCopyWhisper] = useState(
    globalStore.get(storeKeys.COPY_WHISPER, true)
  );

  function handleSwitchChange(copyIsEnabled) {
    setCopyWhisper(copyIsEnabled);

    globalStore.set(storeKeys.COPY_WHISPER, copyIsEnabled);
  }

  return (
    <Box mt={2} mb={2}>
      <Typography variant="subtitle1">
        Copy whisper messages to the clipboard
      </Typography>
      <Switch
        checked={copyWhisper}
        onChange={event => handleSwitchChange(event.target.checked)}
        classes={{
          root: classes.root,
          switchBase: classes.switchBase,
          thumb: classes.thumb,
          track: classes.track,
          checked: classes.checked,
        }}
      />
    </Box>
  );
};

export default clipboard;
