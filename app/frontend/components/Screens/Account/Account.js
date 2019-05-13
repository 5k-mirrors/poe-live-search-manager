import React from "react";
import styled from "styled-components";
import SignIn from "./SignIn/SignIn";
import LoggedIn from "./LoggedIn/LoggedIn";
import useStoreListener from "../../../utils/useStoreListener/useStoreListener";
import { storeKeys } from "../../../../resources/StoreKeys/StoreKeys";
import { Container } from "./Account.style";

const account = () => {
  const [isLoggedIn] = useStoreListener(storeKeys.IS_LOGGED_IN) || false;

  const StyledContainer = styled.div`
    ${Container}
  `;

  return (
    <StyledContainer>{isLoggedIn ? <LoggedIn /> : <SignIn />}</StyledContainer>
  );
};

export default account;
