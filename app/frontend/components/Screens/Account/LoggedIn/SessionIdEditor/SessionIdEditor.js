import React, { useState, Fragment } from "react";
import Box from "@material-ui/core/Box";
import * as customHooks from "../../../../../utils/CustomHooks/CustomHooks";
import { globalStore } from "../../../../../../GlobalStore/GlobalStore";
import { storeKeys } from "../../../../../../resources/StoreKeys/StoreKeys";
import InfoButton from "./InfoButton/InfoButton";
import Input from "../../../../UI/SimpleHtmlElements/Input/Input";
import ButtonWithSuccessIcon from "../../../../UI/ButtonWithSuccessIcon/ButtonWithSuccessIcon";

const sessionIdEditor = () => {
  const [poeSessionId, setPoeSessionId] = useState(
    globalStore.get(storeKeys.POE_SESSION_ID, "")
  );
  const [
    successIconIsVisible,
    displaySuccessIcon,
    hideSuccessIconAfterMsElapsed
  ] = customHooks.useDisplay();

  function onSave() {
    globalStore.set(storeKeys.POE_SESSION_ID, poeSessionId);

    displaySuccessIcon();

    hideSuccessIconAfterMsElapsed(2500);
  }

  return (
    <Fragment>
      <Box display="flex" alignItems="center" mb={3}>
        <Input
          type="text"
          onChange={e => setPoeSessionId(e.target.value)}
          value={poeSessionId}
          label="Session ID"
          error={!poeSessionId}
        />
        <InfoButton />
      </Box>
      <ButtonWithSuccessIcon
        text="Save"
        clickEvent={onSave}
        iconIsVisible={successIconIsVisible}
      />
    </Fragment>
  );
};

export default sessionIdEditor;
