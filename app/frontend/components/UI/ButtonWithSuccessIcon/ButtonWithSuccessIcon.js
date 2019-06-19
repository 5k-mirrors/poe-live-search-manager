import React from "react";
import FlexContainer from "../FlexContainer/FlexContainer";
import Button from "../Button/Button";
import SuccessIcon from "../Icons/Success/Success";

const buttonWithSuccessIcon = ({ iconIsVisible, text, clickEvent }) => (
  <FlexContainer>
    <Button clickEvent={clickEvent} text={text} />
    {iconIsVisible ? <SuccessIcon /> : null}
  </FlexContainer>
);

export default buttonWithSuccessIcon;
