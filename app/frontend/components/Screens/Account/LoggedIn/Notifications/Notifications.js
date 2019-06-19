import React, { useState, Fragment } from "react";
import * as customHooks from "../../../../../utils/CustomHooks/CustomHooks";
import { globalStore } from "../../../../../../GlobalStore/GlobalStore";
import { storeKeys } from "../../../../../../resources/StoreKeys/StoreKeys";
import Button from "../../../../UI/Button/Button";
import SuccessImage from "../../../../UI/SuccessImage/SuccessImage";
import Input from "../../../../UI/Input/Input";
import FlexContainer from "../../../../UI/FlexContainer/FlexContainer";

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
    <Fragment>
      <h3>Interval between notifications</h3>
      <Input
        type="number"
        onChange={e => setNotificationsInterval(e.target.value)}
        value={notificationsInterval}
      />
      <FlexContainer>
        <Button clickEvent={onSave} text="Save" />
        {successIconIsVisible ? <SuccessImage /> : null}
      </FlexContainer>
    </Fragment>
  );
};

export default notifications;
