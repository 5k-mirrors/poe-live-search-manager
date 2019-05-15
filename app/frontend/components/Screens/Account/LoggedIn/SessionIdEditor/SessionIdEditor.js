import React, { useState, Fragment } from "react";
import styled from "styled-components";
import { globalStore } from "../../../../../../GlobalStore/GlobalStore";
import { storeKeys } from "../../../../../../resources/StoreKeys/StoreKeys";
import InfoButton from "./InfoButton/InfoButton";
import { Container, Input, SaveButton } from "./SessionIdEditor.style";

const StyledContainer = styled.div`
  ${Container}
`;

const StyledInput = styled.input`
  ${Input}
`;

const StyledSaveButton = styled.button`
  ${SaveButton}
`;

const sessionIdEditor = () => {
  const [poeSessionId, setPoeSessionId] = useState("");

  function onSaveButtonClick() {
    globalStore.set(storeKeys.POE_SESSION_ID, poeSessionId);
  }

  return (
    <Fragment>
      <StyledContainer>
        <StyledInput
          type="text"
          placeholder="PoE Session ID"
          onChange={e => setPoeSessionId(e.target.value)}
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
