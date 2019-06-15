import React, { useState, Fragment } from "react";
import styled from "styled-components";
import InfoButton from "./InfoButton/InfoButton";
import SuccessIcon from "../../../../../UI/SuccessIcon/SuccessIcon";
import { globalStore } from "../../../../../../../GlobalStore/GlobalStore";
import { storeKeys } from "../../../../../../../resources/StoreKeys/StoreKeys";
import { flexContainer, idInput, saveButton } from "./SessionId.style";
import * as customHooks from "../../../../../../utils/CustomHooks/CustomHooks";

const StyledFlexContainer = styled.div`
  ${flexContainer}
`;

const StyledIdInput = styled.input`
  ${idInput}
`;

const StyledSaveButton = styled.button`
  ${saveButton}
`;

const sessionIdEditor = () => {
  const [poeSessionId, setPoeSessionId] = useState(
    globalStore.get(storeKeys.POE_SESSION_ID, "")
  );
  const [
    showSuccessIcon,
    displayIcon,
    hideIconAfterMsElapsed
  ] = customHooks.useDisplay();

  function saveSessionID() {
    globalStore.set(storeKeys.POE_SESSION_ID, poeSessionId);

    displayIcon();

    hideIconAfterMsElapsed(2500);
  }

  return (
    <Fragment>
      <h5>Session ID</h5>
      <StyledFlexContainer>
        <StyledIdInput
          type="text"
          placeholder="PoE Session ID"
          onChange={e => setPoeSessionId(e.target.value)}
          value={poeSessionId}
        />
        <InfoButton />
      </StyledFlexContainer>
      <StyledFlexContainer>
        <StyledSaveButton type="button" onClick={saveSessionID}>
          Save
        </StyledSaveButton>
        {showSuccessIcon ? <SuccessIcon /> : null}
      </StyledFlexContainer>
    </Fragment>
  );
};

export default sessionIdEditor;
