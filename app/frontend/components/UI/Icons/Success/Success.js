import React from "react";
import styled from "styled-components";
import { cssImage } from "./Success.style";
import successIconPath from "../../../../resources/assets/success.png";

const Image = styled.img`
  ${cssImage}
`;

const successIcon = () => <Image src={successIconPath} />;

export default successIcon;
