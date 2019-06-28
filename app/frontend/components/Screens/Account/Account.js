import React from "react";
import SignIn from "./SignIn/SignIn";
import LoggedIn from "./LoggedIn/LoggedIn";
import * as CustomHooks from "../../../utils/CustomHooks/CustomHooks";
import { storeKeys } from "../../../../resources/StoreKeys/StoreKeys";

const account = () => {
  const [isLoggedIn] =
    CustomHooks.useStoreListener(storeKeys.IS_LOGGED_IN) || false;

  return isLoggedIn ? <LoggedIn /> : <SignIn />;
};

export default account;
