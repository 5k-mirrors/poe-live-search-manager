import React from "react";
import styled from "styled-components";
import { shell } from "electron";
import { button, helpImage } from "./InfoButton.style";
import helpIcon from "../../../../../../resources/assets/PNG/help.png";

const StyledButton = styled.button`
  ${button}
`;

const StyledHelpImage = styled.img`
  ${helpImage}
`;

const infoButton = () => {
  function onInfoButtonClick() {
    shell.openExternal(
      "https://github.com/Stickymaddness/Procurement/wiki/SessionID"
    );
  }

  return (
    <StyledButton onClick={onInfoButtonClick}>
      <StyledHelpImage src={helpIcon} alt="SessionID wiki" />
    </StyledButton>
  );
};

export default infoButton;
