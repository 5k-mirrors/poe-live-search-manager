import React from "react";
import styled from "styled-components";
import { cssInput } from "./Input.style";

const Input = styled.input`
  ${cssInput}
`;

const input = ({ ...props }) => <Input {...props} />;

export default input;
