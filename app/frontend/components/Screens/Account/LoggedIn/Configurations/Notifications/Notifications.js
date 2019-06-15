import React, { useState, Fragment } from "react";
import styled from "styled-components";
import SuccessIcon from "../../../../../UI/SuccessIcon/SuccessIcon";
import * as customHooks from "../../../../../../utils/CustomHooks/CustomHooks";
import { globalStore } from "../../../../../../../GlobalStore/GlobalStore";
import { storeKeys } from "../../../../../../../resources/StoreKeys/StoreKeys";
import { intervalInput, saveButton } from "./Notifications.style";

const StyledIntervalInput = styled.input`
  ${intervalInput}
`;

const StyledSaveButton = styled.button`
  ${saveButton}
`;

const notifications = () => {
  const [interval, setInterval] = useState(
    globalStore.get(storeKeys.NOTIFICATIONS_INTERVAL, 3)
  );
  const [
    showSuccessIcon,
    displayIcon,
    hideIconAfterMsElapsed
  ] = customHooks.useDisplay();

  function saveNotificationsInterval() {
    globalStore.set(storeKeys.NOTIFICATIONS_INTERVAL, interval);

    displayIcon();

    hideIconAfterMsElapsed(2500);
  }

  return (
    <Fragment>
      <h5>Seconds between notifications</h5>
      <StyledIntervalInput
        type="number"
        value={interval}
        onChange={e => setInterval(e.target.value)}
      />
      <StyledSaveButton type="button" onClick={saveNotificationsInterval}>
        Save
      </StyledSaveButton>
      {showSuccessIcon ? <SuccessIcon /> : null}
    </Fragment>
  );
};

export default notifications;
