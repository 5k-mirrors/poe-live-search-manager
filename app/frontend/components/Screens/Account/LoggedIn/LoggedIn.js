import React from "react";
import styled from "styled-components";
import Header from "./Header/Header";
import Configurations from "./Configurations/Configurations";
import SubscriptionDetails from "./SubscriptionDetails/SubscriptionDetails";
import { container } from "./LoggedIn.style";

const StyledContainer = styled.div`
  ${container}
`;

const loggedIn = () => (
  <StyledContainer>
    <Header />
    <Configurations />
    <SubscriptionDetails />
  </StyledContainer>
);

export default loggedIn;
