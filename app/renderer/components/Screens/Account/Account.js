import React from "react";
import SignIn from "./SignIn/SignIn";
import LoggedIn from "./LoggedIn/LoggedIn";
import Loader from "../../UI/Loader/Loader";
import { useAuthContext } from "../../../contexts/Auth";

export default () => {
  const auth = useAuthContext();

  if (auth.isLoading) {
    return <Loader />;
  }

  return auth.isLoggedIn ? <LoggedIn /> : <SignIn />;
};
