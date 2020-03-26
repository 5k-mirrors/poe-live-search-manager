import React, {
  createContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import compareVersions from "compare-versions";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { openExternalUrl } from "../utils/ElectronUtils/ElectronUtils";
import { useFactoryContext } from "../utils/ReactUtils/ReactUtils";
import {
  privacyPolicyActions,
  privacyPolicyReducer,
  privacyPolicyInitialState,
  initPrivacyPolicyState,
} from "../reducers/reducers";
import privacyPolicy from "../../resources/PrivacyPolicy/PrivacyPolicy";

const CheckboxLabel = () => (
  <span>
    {`I have read and I accept the `}
    {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
    <Link
      component="button"
      variant="body1"
      onClick={() => openExternalUrl(privacyPolicy.link)}
    >
      Privacy Policy.
    </Link>
  </span>
);

const PrivacyPolicyContext = createContext(null);
PrivacyPolicyContext.displayName = "PrivacyPolicyContext";

export const PrivacyPolicyProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    privacyPolicyReducer,
    privacyPolicyInitialState,
    initPrivacyPolicyState
  );
  const history = useHistory();

  const policyChanged = useCallback(() => {
    if (!state.link || !state.version) {
      return true;
    }

    return compareVersions(privacyPolicy.version, state.version, ">");
  }, [state.link, state.version]);

  useEffect(() => {
    if ((!state.loggedIn && !state.accepted) || policyChanged()) {
      dispatch({ type: privacyPolicyActions.SHOW_DIALOG });
    } else {
      // This branch runs when the user is signed in and the version of its accepted privacy policy is equal to the one stored offline.
      dispatch({ type: privacyPolicyActions.HANDLE_ACCEPTANCE });
    }
  }, [policyChanged, state.accepted, state.loggedIn]);

  useEffect(() => {
    if (state.accepted) {
      history.push("/account");
    }
  }, [history, state.accepted]);

  const handleAcceptance = () => {
    dispatch({
      type: privacyPolicyActions.HANDLE_ACCEPTANCE,
      payload: privacyPolicy,
    });
  };

  const handleCheckboxChange = () => {
    dispatch({ type: privacyPolicyActions.HANDLE_CHECKBOX_CHANGE });
  };

  const DialogCheckbox = () => (
    <Checkbox
      checked={state.checked}
      onChange={handleCheckboxChange}
      value={state.checked}
      color="primary"
    />
  );

  const renderDialog = () => (
    <Dialog open={state.showDialog}>
      <DialogTitle>Privacy Policy</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <FormControlLabel
            control={<DialogCheckbox />}
            label={<CheckboxLabel />}
          />
        </DialogContentText>
        <DialogActions>
          <Button
            color="primary"
            variant="contained"
            disabled={!state.checked}
            onClick={handleAcceptance}
          >
            Agree
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );

  return (
    <PrivacyPolicyContext.Provider value={{ state, dispatch }}>
      {children}
      {renderDialog()}
    </PrivacyPolicyContext.Provider>
  );
};

export const usePrivacyPolicyContext = () =>
  useFactoryContext(PrivacyPolicyContext);
