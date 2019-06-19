import React, { useState, Fragment } from "react";
import styled from "styled-components";
import { globalStore } from "../../../../../../GlobalStore/GlobalStore";
import { storeKeys } from "../../../../../../resources/StoreKeys/StoreKeys";
import InfoButton from "./InfoButton/InfoButton";
import {
  flexContainer,
  idInput,
  saveButton,
  successImage
} from "./SessionIdEditor.style";
import SuccessIcon from "../../../../../resources/assets/success.png";
import * as customHooks from "../../../../../utils/CustomHooks/CustomHooks";

const StyledFlexContainer = styled.div`
  ${flexContainer}
`;

const StyledIdInput = styled.input`
  ${idInput}
`;

const StyledSaveButton = styled.button`
  ${saveButton}
`;

const StyledSuccessImage = styled.img`
  ${successImage}
`;

const sessionIdEditor = () => {
  const [poeSessionId, setPoeSessionId] = useState(
    globalStore.get(storeKeys.POE_SESSION_ID, "")
  );
  const [
    showSuccessIcon,
    displaySuccessIcon,
    hideSuccessIconAfterMsElapsed
  ] = customHooks.useDisplay();

  function onSaveButtonClick() {
    globalStore.set(storeKeys.POE_SESSION_ID, poeSessionId);

    displaySuccessIcon();

    hideSuccessIconAfterMsElapsed(2500);
  }

  return (
    <Fragment>
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
        <StyledSaveButton type="button" onClick={onSaveButtonClick}>
          Save
        </StyledSaveButton>
        {showSuccessIcon ? (
          <StyledSuccessImage src={SuccessIcon} alt="Success" />
        ) : null}
      </StyledFlexContainer>
    </Fragment>
  );
};

export default sessionIdEditor;
