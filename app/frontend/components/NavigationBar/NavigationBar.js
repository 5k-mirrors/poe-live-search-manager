import React from "react";
import styled from "styled-components";
import NavigationBarItem from "./NavigationBarItem/NavigationBarItem";
import { Container, ItemsList } from "./NavigationBar.style";
import { routes } from "../../resources/Routes/Routes";

const StyledContainer = styled.div`
  ${Container}
`;

const StyledItemsList = styled.ul`
  ${ItemsList}
`;

const navigationBar = () => (
  <StyledContainer>
    <StyledItemsList>
      {routes.map(route => (
        <NavigationBarItem
          key={route.displayName}
          displayName={route.displayName}
          routePath={route.routePath}
        />
      ))}
    </StyledItemsList>
  </StyledContainer>
);

export default navigationBar;
