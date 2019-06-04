import React from "react";
import styled from "styled-components";
import { buttonStyle } from "./Button.style";

const StyledButton = styled.button`
  ${buttonStyle}
`;

const button = ({ text, clickEvent }) => (
  <StyledButton onClick={clickEvent}>{text}</StyledButton>
);

export default button;
