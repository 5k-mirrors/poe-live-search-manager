import React from "react";
import styled from "styled-components";
import SignIn from "./SignIn/SignIn";
import LoggedIn from "./LoggedIn/LoggedIn";
import useStoreListener from "../../../utils/useStoreListener/useStoreListener";
import { storeKeys } from "../../../../resources/StoreKeys/StoreKeys";
import { container } from "./Account.style";

const StyledContainer = styled.div`
  ${container}
`;

const account = () => {
  const [isLoggedIn] = useStoreListener(storeKeys.IS_LOGGED_IN) || false;

  return (
    <StyledContainer>{isLoggedIn ? <LoggedIn /> : <SignIn />}</StyledContainer>
  );
};

export default account;
