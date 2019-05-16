import React from "react";
import styled from "styled-components";
import { shell } from "electron";
import { button, image } from "./InfoButton.style";
import HelpIcon from "../../../../../../resources/assets/help.png";

const StyledButton = styled.button`
  ${button}
`;

const StyledImage = styled.img`
  ${image}
`;

const infoButton = () => {
  function onInfoButtonClick() {
    shell.openExternal(
      "https://github.com/Stickymaddness/Procurement/wiki/SessionID"
    );
  }

  return (
    <StyledButton onClick={onInfoButtonClick}>
      <StyledImage src={HelpIcon} alt="SessionID wiki" />
    </StyledButton>
  );
};

export default infoButton;
