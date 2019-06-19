import React, { useState, useEffect, Fragment } from "react";
import styled from "styled-components";
import { globalStore } from "../../../../../../GlobalStore/GlobalStore";
import { storeKeys } from "../../../../../../resources/StoreKeys/StoreKeys";
import InfoButton from "./InfoButton/InfoButton";
import { flexContainer, idInput, successImage } from "./SessionIdEditor.style";
import SuccessIcon from "../../../../../resources/assets/success.png";
import Button from "../../../../UI/Button/Button";

const StyledFlexContainer = styled.div`
  ${flexContainer}
`;

const StyledIdInput = styled.input`
  ${idInput}
`;

const StyledSuccessImage = styled.img`
  ${successImage}
`;

const sessionIdEditor = () => {
  const [poeSessionId, setPoeSessionId] = useState(
    globalStore.get(storeKeys.POE_SESSION_ID, "")
  );
  const [showSuccessIcon, setShowSuccessIcon] = useState(false);

  let timer;

  useEffect(() => {
    return () => clearInterval(timer);
  }, []);

  function onSaveButtonClick() {
    globalStore.set(storeKeys.POE_SESSION_ID, poeSessionId);

    setShowSuccessIcon(true);

    timer = setTimeout(() => {
      setShowSuccessIcon(false);
    }, 2500);
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
        <Button clickEvent={onSaveButtonClick} text="Save" />
        {showSuccessIcon ? (
          <StyledSuccessImage src={SuccessIcon} alt="Success" />
        ) : null}
      </StyledFlexContainer>
    </Fragment>
  );
};

export default sessionIdEditor;
