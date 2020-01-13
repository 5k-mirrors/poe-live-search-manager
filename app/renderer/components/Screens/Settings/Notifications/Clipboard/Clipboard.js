import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import ToggleButton from "../../../../UI/ToggleButton/ToggleButton";
import GlobalStore from "../../../../../../GlobalStore/GlobalStore";
import { storeKeys } from "../../../../../../resources/StoreKeys/StoreKeys";

const clipboard = () => {
  const globalStore = new GlobalStore();

  return (
    <Box mt={2} mb={2}>
      <Typography variant="subtitle1">
        Copy whisper messages to the clipboard
      </Typography>
      <ToggleButton
        defaultState={globalStore.get(storeKeys.COPY_WHISPER, true)}
        changed={copyWhisper =>
          globalStore.set(storeKeys.COPY_WHISPER, copyWhisper)
        }
      />
    </Box>
  );
};

export default clipboard;
