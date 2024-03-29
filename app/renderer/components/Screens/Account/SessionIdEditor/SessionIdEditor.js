import React, { useState, Fragment } from "react";
import Box from "@mui/material/Box";
import { ipcRenderer } from "electron";
import GlobalStore from "../../../../../shared/GlobalStore/GlobalStore";
import { storeKeys } from "../../../../../shared/resources/StoreKeys/StoreKeys";
import { ipcEvents } from "../../../../../shared/resources/IPCEvents/IPCEvents";
import InfoButton from "./InfoButton/InfoButton";
import Input from "../../../UI/SimpleHtmlElements/Input/Input";
import ButtonWithSuccessIcon from "../../../UI/ButtonWithSuccessIcon/ButtonWithSuccessIcon";

export default () => {
  const globalStore = GlobalStore.getInstance();

  const [poeSessionId, setPoeSessionId] = useState(
    globalStore.get(storeKeys.POE_SESSION_ID)
  );

  function idIsDefined() {
    return poeSessionId !== "" && typeof poeSessionId !== "undefined";
  }

  function onSave() {
    globalStore.set(
      storeKeys.POE_SESSION_ID,
      idIsDefined() ? poeSessionId : null
    );

    ipcRenderer.send(ipcEvents.RECONNECT_ALL);

    return Promise.resolve();
  }

  return (
    <Fragment>
      <Box display="flex" alignItems="center" mb={3}>
        <Input
          type="text"
          onChange={e => setPoeSessionId(e.target.value)}
          value={poeSessionId || ""}
          label="Session ID"
          error={!poeSessionId}
        />
        <InfoButton />
      </Box>
      <ButtonWithSuccessIcon text="Save" clickEventHandler={onSave} />
    </Fragment>
  );
};
