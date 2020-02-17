import React, { createContext, useState, useReducer, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { useFactoryContext } from "../utils/ReactUtils/ReactUtils";
import { useFirebaseAuthObserver } from "../utils/CustomHooks/CustomHooks";

// it'll likely be a static field and be updated per release
// improvements under the hood

const PrivacyPolicyContext = createContext();
PrivacyPolicyContext.displayName = "PrivacyPolicyContext";

const actions = {
  SHOW_DIALOG: "showDialog",
  CHECKED_CHANGED: "checkedChanged,",
  AGREED: "agreed",
};

const reducer = (state, action) => {
  switch (action.type) {
    case actions.SHOW_DIALOG: {
      return {
        ...state,
        showAcceptanceDialog: true,
      };
    }
    case actions.CHECKED_CHANGED: {
      return {
        ...state,
        accepted: action.payload.accepted,
      };
    }
    case actions.AGREED: {
      return {
        ...state,
      };
    }
    default:
      break;
  }
};

export const PrivacyPolicyProvider = ({ children }) => {
  /*   const [showAcceptanceDialog, setShowAcceptanceDialog] = useState(false);
  const [checked, setChecked] = useState(false); */
  const [state, dispatch] = useReducer({
    showAcceptanceDialog: false,
    accepted: false,
    privacyPolicy: {
      url: null,
      version: null,
    },
  });
  const { authenticated } = useFirebaseAuthObserver();

  useEffect(() => {
    if (!authenticated) {
      // setShowAcceptanceDialog(true);
    }
  }, [authenticated]);

  return (
    <PrivacyPolicyContext.Provider>{children}</PrivacyPolicyContext.Provider>
  );
};

export const usePrivacyPolicyContext = () =>
  useFactoryContext(PrivacyPolicyContext);
