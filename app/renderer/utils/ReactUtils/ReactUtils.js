import { useContext } from "react";

export const useFactoryContext = context => {
  const ctx = useContext(context);

  if (!ctx) {
    throw new Error(
      `${context.displayName} cannot be used outside the provider.`
    );
  }

  return ctx;
};
