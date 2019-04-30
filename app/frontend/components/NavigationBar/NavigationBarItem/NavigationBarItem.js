import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Item } from "./NavigationBarItem.style";

const navigationBarItem = ({ displayName, routePath }) => {
  const StyledItem = styled.li`
    ${Item}
  `;

  return (
    <StyledItem>
      <Link to={routePath}>{displayName}</Link>
    </StyledItem>
  );
};

export default navigationBarItem;
