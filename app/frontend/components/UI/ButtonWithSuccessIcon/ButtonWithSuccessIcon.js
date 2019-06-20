import React from "react";
import FlexContainer from "../FlexContainer/FlexContainer";
import Button from "../Button/Button";
import SuccessImage from "../SuccessImage/SuccessImage";

const buttonWithSuccessIcon = ({ iconIsVisible, text, clickEvent }) => (
  <FlexContainer>
    <Button clickEvent={clickEvent} text={text} />
    {iconIsVisible ? <SuccessImage /> : null}
  </FlexContainer>
);

export default buttonWithSuccessIcon;
