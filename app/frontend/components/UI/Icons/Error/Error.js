import React from "react";
import styled from "styled-components";
import { errorStyle } from "./Error.style";
import errorIconPath from "../../../../resources/assets/error.png";

const Error = styled.img`
  ${errorStyle}
`;

const error = () => <Error src={errorIconPath} />;

export default error;
