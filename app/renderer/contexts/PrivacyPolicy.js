import React, { createContext, useEffect, useReducer } from "react";
import { useFactoryContext } from "../utils/ReactUtils/ReactUtils";
import { getApp as getFirebaseApp } from "../utils/Firebase/Firebase";
import {
  initState,
  privacyPolicyActions,
  privacyPolicyReducer,
} from "../reducers/reducers";

const PrivacyPolicyContext = createContext(null);
PrivacyPolicyContext.displayName = "PrivacyPolicyContext";

export const PrivacyPolicyProvider = ({ children }) => {
  const [policy, dispatch] = useReducer(privacyPolicyReducer, null, initState);

  // @TODO Extract this to a custom hook.
  useEffect(() => {
    const registerObserver = () => {
      const firebaseApp = getFirebaseApp();

      return firebaseApp.auth().onAuthStateChanged(user => {
        const authenticated = !!user;

        if (!authenticated) {
          dispatch({ type: privacyPolicyActions.RESET });
        }
      });
    };

    const unregisterObserver = registerObserver();

    return () => unregisterObserver();
  }, []);

  return (
    <PrivacyPolicyContext.Provider value={{ policy, dispatch }}>
      {children}
    </PrivacyPolicyContext.Provider>
  );
};

export const usePrivacyPolicy = () => useFactoryContext(PrivacyPolicyContext);
