import React from "react";
import styled from "styled-components";
import { cssFlexContainer } from "./FlexContainer.style";

const FlexContainer = styled.div`
  ${cssFlexContainer}
`;

const flexContainer = ({ children }) => (
  <FlexContainer>{children}</FlexContainer>
);

export default flexContainer;
