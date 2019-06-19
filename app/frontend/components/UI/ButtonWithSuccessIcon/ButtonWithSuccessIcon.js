import React from "react";
import FlexContainer from "../GeneralElements/FlexContainer/FlexContainer";
import Button from "../GeneralElements/Button/Button";
import SuccessIcon from "../Icons/Success/Success";

const buttonWithSuccessIcon = ({ iconIsVisible, text, clickEvent }) => (
  <FlexContainer>
    <Button clickEvent={clickEvent} text={text} />
    {iconIsVisible ? <SuccessIcon /> : null}
  </FlexContainer>
);

export default buttonWithSuccessIcon;
