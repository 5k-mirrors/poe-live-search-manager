import React from "react";
import styled from "styled-components";
import { cssButton } from "./Button.style";

const Button = styled.button`
  ${cssButton}
`;

const button = ({ clickEvent, text }) => (
  <Button onClick={clickEvent}>{text}</Button>
);

export default button;
