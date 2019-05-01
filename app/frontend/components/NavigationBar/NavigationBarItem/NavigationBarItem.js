import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { Item } from "./NavigationBarItem.style";

const navigationBarItem = ({ displayName, routePath }) => {
  const StyledItem = styled.li`
    ${Item}
  `;

  return (
    <StyledItem>
      <NavLink to={routePath}>{displayName}</NavLink>
    </StyledItem>
  );
};

export default navigationBarItem;
