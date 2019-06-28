import React, { useState, Fragment } from "react";
import { ipcRenderer } from "electron";
import Box from "@material-ui/core/Box";
import * as customHooks from "../../../../utils/CustomHooks/CustomHooks";
import { globalStore } from "../../../../../GlobalStore/GlobalStore";
import { storeKeys } from "../../../../../resources/StoreKeys/StoreKeys";
import { ipcEvents } from "../../../../../resources/IPCEvents/IPCEvents";
import Input from "../../../UI/SimpleHtmlElements/Input/Input";
import Button from "../../../UI/SimpleHtmlElements/Button/Button";
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

  function sendTestNotification() {
    ipcRenderer.send(ipcEvents.TEST_NOTIFICATION);
  }

  return (
    <Fragment>
      <Input
        type="number"
        onChange={e => setNotificationsInterval(e.target.value)}
        value={notificationsInterval}
        label="Notifications interval"
        margin="normal"
      />
      <Box mb={1}>
        <ButtonWithSuccessIcon
          text="Save"
          clickEvent={onSave}
          iconIsVisible={successIconIsVisible}
        />
      </Box>
      <Box>
        <Button
          text="Send a test notification"
          clickEvent={sendTestNotification}
        />
      </Box>
    </Fragment>
  );
};

export default notifications;
