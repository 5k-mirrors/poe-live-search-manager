import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import * as customHooks from "../../../../utils/CustomHooks/CustomHooks";
import { globalStore } from "../../../../../GlobalStore/GlobalStore";
import { storeKeys } from "../../../../../resources/StoreKeys/StoreKeys";
import Input from "../../../UI/SimpleHtmlElements/Input/Input";
import ButtonWithSuccessIcon from "../../../UI/ButtonWithSuccessIcon/ButtonWithSuccessIcon";

const notifications = () => {
  const [notificationsInterval, setNotificationsInterval] = useState(
    globalStore.get(storeKeys.NOTIFICATIONS_INTERVAL, 3)
  );
  const [
    successIconIsVisible,
    displaySuccessIcon,
    hideSuccessIconAfterMsElapsed
  ] = customHooks.useDisplay();

  function onSave() {
    globalStore.set(storeKeys.NOTIFICATIONS_INTERVAL, notificationsInterval);

    displaySuccessIcon();

    hideSuccessIconAfterMsElapsed(2500);
  }
  return (
    <Box>
      <Input
        type="number"
        onChange={e => setNotificationsInterval(e.target.value)}
        value={notificationsInterval}
        label="Notifications interval"
        margin="normal"
      />
      <Box>
        <ButtonWithSuccessIcon
          text="Save"
          clickEvent={onSave}
          iconIsVisible={successIconIsVisible}
        />
      </Box>
    </Box>
  );
};

export default notifications;
