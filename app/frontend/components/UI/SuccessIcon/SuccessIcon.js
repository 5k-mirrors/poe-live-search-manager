import React from "react";
import styled from "styled-components";
import { image } from "./SuccessIcon.style";
import successImage from "../../../resources/assets/success.png";

const StyledImage = styled.img`
  ${image}
`;

const successIcon = () => <StyledImage src={successImage} alt="Success" />;

export default successIcon;
