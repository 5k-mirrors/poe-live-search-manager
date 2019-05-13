import React, { useState } from "react";
import styled from "styled-components";
import { globalStore } from "../../../../../../GlobalStore/GlobalStore";
import { storeKeys } from "../../../../../../resources/StoreKeys/StoreKeys";
import { Container, Input, SaveButton } from "./SessionIdEditor.style";
// import Help from "../../../../../resources/assets/help.png";

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

  // TODO: How to open link in the default browser?
  // https://stackoverflow.com/questions/31749625/make-a-link-from-electron-open-in-browser
  return (
    <React.Fragment>
      <StyledContainer>
        <StyledInput
          type="text"
          placeholder="PoE Session ID"
          onChange={e => onPoeSessionIdChange(e)}
          value={poeSessionId}
        />
      </StyledContainer>
      <StyledSaveButton type="button" onClick={onSaveButtonClick}>
        Save
      </StyledSaveButton>
    </React.Fragment>
  );
};

export default sessionIdEditor;
