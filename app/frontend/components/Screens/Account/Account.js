import React from "react";
import SignIn from "./SignIn/SignIn";
import LoggedIn from "./LoggedIn/LoggedIn";
import useStoreListener from "../../../utils/useStoreListener/useStoreListener";
import { storeKeys } from "../../../../resources/StoreKeys/StoreKeys";

const account = () => {
  const [isLoggedIn] = useStoreListener(storeKeys.IS_LOGGED_IN) || false;

  if (!isLoggedIn) {
    return <SignIn />;
  }

  return <LoggedIn />;
};

export default account;
