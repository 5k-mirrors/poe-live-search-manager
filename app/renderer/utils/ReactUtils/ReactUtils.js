import { useContext } from "react";

export const factoryContext = context => () => {
  const ctx = useContext(context);

  if (typeof ctx === "undefined") {
    throw new Error(
      `${context.displayName} cannot be used outside the provider.`
    );
  }

  return ctx;
};
