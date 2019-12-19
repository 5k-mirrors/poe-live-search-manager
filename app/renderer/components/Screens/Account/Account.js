import React from "react";
import SignIn from "./SignIn/SignIn";
import LoggedIn from "./LoggedIn/LoggedIn";
import { useListenToPersistentStorageChangeViaKey } from "../../../utils/CustomHooks/CustomHooks";
import { storeKeys } from "../../../../resources/StoreKeys/StoreKeys";

export default () => {
  const isLoggedIn = useListenToPersistentStorageChangeViaKey(
    storeKeys.IS_LOGGED_IN
  );

  return isLoggedIn ? <LoggedIn /> : <SignIn />;
};
