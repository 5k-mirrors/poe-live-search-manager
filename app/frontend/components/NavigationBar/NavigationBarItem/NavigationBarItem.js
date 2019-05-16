import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { Item } from "./NavigationBarItem.style";

const StyledItem = styled.li`
  ${Item}
`;

const navLinkActiveStyle = {
  color: "#000000",
  background: "#FFFFFF",
  padding: "3px 5px"
};

const navigationBarItem = ({ displayName, routePath }) => (
  <StyledItem>
    <NavLink activeStyle={navLinkActiveStyle} to={routePath}>
      {displayName}
    </NavLink>
  </StyledItem>
);

export default navigationBarItem;
