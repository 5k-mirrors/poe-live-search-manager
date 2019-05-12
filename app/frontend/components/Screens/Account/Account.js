import React from "react";
import SignIn from "./SignIn/SignIn";
import LoggedIn from "./LoggedIn/LoggedIn";
import useStoreListener from "../../../utils/useStoreListener/useStoreListener";

const account = () => {
  const [isLoggedIn] = useStoreListener("isLoggedIn") || false;

  if (!isLoggedIn) {
    return <SignIn />;
  }

  return <LoggedIn />;
};

export default account;
