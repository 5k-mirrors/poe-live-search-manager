import React, { useState, useEffect } from "react";
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
  const [showSuccess, startSuccessTimeout] = customHooks.useBooleanTimeout(
    2500
  );

  let timer;

  useEffect(() => {
    return () => clearInterval(timer);
  }, []);

  function saveNotificationsInterval() {
    globalStore.set(storeKeys.NOTIFICATIONS_INTERVAL, interval);

    startSuccessTimeout();
  }

  return (
    <div>
      <h5>Seconds between notifications</h5>
      <StyledIntervalInput
        type="number"
        value={interval}
        onChange={e => setInterval(e.target.value)}
      />
      <StyledSaveButton type="button" onClick={saveNotificationsInterval}>
        Save
      </StyledSaveButton>
      {showSuccess ? <SuccessIcon /> : null}
    </div>
  );
};

export default notifications;
