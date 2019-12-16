import { useContext } from "react";
import { AuthDataProvider, AuthDataContext } from "./AuthData";
import {
  SubscriptionDataProvider,
  SubscriptionDataContext,
} from "./SubscriptionData";

const factoryContext = context => () => {
  const ctx = useContext(context);

  if (typeof ctx === "undefined") {
    throw new Error("Context value cannot be consumed outside providers.");
  }

  return ctx;
};

const useAuthDataContext = factoryContext(AuthDataContext);
const useSubscriptionDataContext = factoryContext(SubscriptionDataContext);

export {
  AuthDataProvider,
  useAuthDataContext,
  SubscriptionDataProvider,
  useSubscriptionDataContext,
};
