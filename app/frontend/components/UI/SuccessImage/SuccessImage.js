import React from "react";
import styled from "styled-components";
import { cssImage } from "./SuccessImage.style";
import successIcon from "../../../resources/assets/success.png";

const Image = styled.img`
  ${cssImage}
`;

const successImage = () => <Image src={successIcon} />;

export default successImage;
