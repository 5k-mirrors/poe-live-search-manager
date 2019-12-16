import React from "react";
import SignIn from "./SignIn/SignIn";
import LoggedIn from "./LoggedIn/LoggedIn";
import { useAuthDataContext } from "../../../contexts";

const account = () => {
  const authData = useAuthDataContext();

  if (authData) {
    return <LoggedIn />;
  }

  return <SignIn />;
};

export default account;
