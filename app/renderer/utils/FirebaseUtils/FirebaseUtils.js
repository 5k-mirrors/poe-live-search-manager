import { useContext, createContext } from "react";

const defaultFirebaseContextState = {
  app: null,
  isLoading: true,
  currentUser: null,
};

export const FirebaseContext = createContext({
  ...defaultFirebaseContextState,
});

export const useFirebaseContext = () => useContext(FirebaseContext);
