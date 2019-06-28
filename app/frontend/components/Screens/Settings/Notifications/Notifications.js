import React, { useState, Fragment } from "react";
import { ipcRenderer } from "electron";
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
      <h3>Interval between notifications(in seconds)</h3>
      <Input
        type="number"
        onChange={e => setNotificationsInterval(e.target.value)}
        value={notificationsInterval}
      />
      <ButtonWithSuccessIcon
        text="Save"
        clickEvent={onSave}
        iconIsVisible={successIconIsVisible}
      />
      <Button
        text="Send a test notification"
        clickEvent={sendTestNotification}
      />
    </Fragment>
  );
};

export default notifications;
