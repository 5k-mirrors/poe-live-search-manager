import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { navItem } from "./NavigationBarItem.style";

const StyledNavItem = styled.li`
  ${navItem}
`;

const navLinkActiveStyle = {
  color: "#000000",
  background: "#FFFFFF",
  padding: "3px 5px"
};

const navigationBarItem = ({ displayName, routePath }) => (
  <StyledNavItem>
    <NavLink activeStyle={navLinkActiveStyle} to={routePath}>
      {displayName}
    </NavLink>
  </StyledNavItem>
);

export default navigationBarItem;
