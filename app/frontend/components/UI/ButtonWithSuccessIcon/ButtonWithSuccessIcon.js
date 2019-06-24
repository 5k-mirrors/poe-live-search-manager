import React from "react";
import FlexContainer from "../SimpleHtmlElements/FlexContainer/FlexContainer";
import Button from "../SimpleHtmlElements/Button/Button";
import IconDispalyer from "../IconDisplayer/IconDisplayer";
import successIcon from "../../../resources/assets/PNG/success.png";

const buttonWithSuccessIcon = ({ iconIsVisible, text, clickEvent }) => (
  <FlexContainer>
    <Button clickEvent={clickEvent} text={text} />
    {iconIsVisible ? <IconDispalyer path={successIcon} /> : null}
  </FlexContainer>
);

export default buttonWithSuccessIcon;
