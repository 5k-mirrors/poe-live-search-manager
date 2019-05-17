import React from "react";
import styled from "styled-components";
import NavigationBarItem from "./NavigationBarItem/NavigationBarItem";
import { navContainer, itemsList } from "./NavigationBar.style";
import { routes } from "../../resources/Routes/Routes";

const StyledNavContainer = styled.div`
  ${navContainer}
`;

const StyledItemsList = styled.ul`
  ${itemsList}
`;

const navigationBar = () => (
  <StyledNavContainer>
    <StyledItemsList>
      {routes.map(route => (
        <NavigationBarItem
          key={route.displayName}
          displayName={route.displayName}
          routePath={route.routePath}
        />
      ))}
    </StyledItemsList>
  </StyledNavContainer>
);

export default navigationBar;
