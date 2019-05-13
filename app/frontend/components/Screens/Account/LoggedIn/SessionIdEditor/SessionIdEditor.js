import React, { useState, Fragment } from "react";
import styled from "styled-components";
import { globalStore } from "../../../../../../GlobalStore/GlobalStore";
import { storeKeys } from "../../../../../../resources/StoreKeys/StoreKeys";
import InfoButton from "./InfoButton/InfoButton";
import { Container, Input, SaveButton } from "./SessionIdEditor.style";

const sessionIdEditor = () => {
  const [poeSessionId, setPoeSessionId] = useState("");

  function onPoeSessionIdChange(e) {
    setPoeSessionId(e.target.value);
  }

  function onSaveButtonClick() {
    globalStore.set(storeKeys.POE_SESSION_ID, poeSessionId);
  }

  const StyledContainer = styled.div`
    ${Container}
  `;

  const StyledInput = styled.input`
    ${Input}
  `;

  const StyledSaveButton = styled.button`
    ${SaveButton}
  `;

  return (
    <Fragment>
      <StyledContainer>
        <StyledInput
          type="text"
          placeholder="PoE Session ID"
          onChange={e => onPoeSessionIdChange(e)}
          value={poeSessionId}
        />
        <InfoButton />
      </StyledContainer>
      <StyledSaveButton type="button" onClick={onSaveButtonClick}>
        Save
      </StyledSaveButton>
    </Fragment>
  );
};

export default sessionIdEditor;
