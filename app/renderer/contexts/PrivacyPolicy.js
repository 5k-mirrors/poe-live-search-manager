import React, { createContext, useState, useEffect, useCallback } from "react";
import { ipcRenderer } from "electron";
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
import { ipcEvents } from "../../resources/IPCEvents/IPCEvents";
import { openExternalUrl } from "../utils/ElectronUtils/ElectronUtils";
import GlobalStore from "../../GlobalStore/GlobalStore";
import { storeKeys } from "../../resources/StoreKeys/StoreKeys";
import { useFactoryContext } from "../utils/ReactUtils/ReactUtils";
import privacyPolicy from "../../resources/PrivacyPolicy/PrivacyPolicy";

const CheckboxLabel = () => (
  <span>
    I have read and I accept the
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

export const initialState = {
  showDialog: false,
  confirmed: false,
  checked: false,
};

export const PrivacyPolicyProvider = ({ children }) => {
  const [policy, setPolicy] = useState(initialState);
  const [loggedIn, setLoggedIn] = useState(() => {
    const globalStore = GlobalStore.getInstance();

    return globalStore.get(storeKeys.IS_LOGGED_IN, false);
  });
  const history = useHistory();

  const privacyPolicyChanged = useCallback(() => {
    const globalStore = GlobalStore.getInstance();

    const acceptedPrivacyPolicy = globalStore.get(
      storeKeys.ACCEPTED_PRIVACY_POLICY,
      null
    );

    if (!acceptedPrivacyPolicy || !acceptedPrivacyPolicy.version) {
      return true;
    }

    return (
      compareVersions(privacyPolicy.version, acceptedPrivacyPolicy.version) ===
      1
    );
  }, []);

  useEffect(() => {
    const globalStore = GlobalStore.getInstance();

    const unsubscribe = globalStore.onDidChange(
      storeKeys.IS_LOGGED_IN,
      isLoggedIn => {
        setLoggedIn(isLoggedIn);
      }
    );

    if (!loggedIn || privacyPolicyChanged()) {
      setPolicy(() => ({
        ...initialState,
        showDialog: true,
      }));
    } else {
      setPolicy(() => ({
        ...initialState,
        confirmed: true,
      }));
    }

    return () => unsubscribe();
  }, [loggedIn, privacyPolicyChanged]);

  const handlePrivacyPolicyConfirmation = () => {
    ipcRenderer.send(ipcEvents.ACCEPTED_PRIVACY_POLICY_UPDATED, privacyPolicy);

    history.push("/account");

    setPolicy(prevState => ({
      ...prevState,
      confirmed: true,
      showDialog: false,
    }));
  };

  const handleCheckboxChange = () => {
    setPolicy(prevState => ({
      ...prevState,
      checked: !prevState.checked,
    }));
  };

  const renderDialog = () => (
    <Dialog open={policy.showDialog}>
      <DialogTitle>Privacy Policy</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <FormControlLabel
            control={
              // eslint-disable-next-line react/jsx-wrap-multilines
              <Checkbox
                checked={policy.checked}
                onChange={handleCheckboxChange}
                value={policy.checked}
                color="primary"
              />
            }
            label={<CheckboxLabel />}
          />
        </DialogContentText>
        <DialogActions>
          <Button
            color="primary"
            variant="contained"
            disabled={!policy.checked}
            onClick={handlePrivacyPolicyConfirmation}
          >
            Agree
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );

  return (
    <PrivacyPolicyContext.Provider>
      {children}
      {renderDialog()}
    </PrivacyPolicyContext.Provider>
  );
};

export const usePrivacyPolicyContext = () =>
  useFactoryContext(PrivacyPolicyContext);
