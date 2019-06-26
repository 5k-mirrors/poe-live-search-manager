import React from "react";
import styled from "styled-components";
import { iconStyle } from "./IconDisplayer.style";

const Icon = styled.img`
  ${iconStyle}
`;

const iconDisplayer = ({ path }) => <Icon src={path} />;

export default iconDisplayer;
