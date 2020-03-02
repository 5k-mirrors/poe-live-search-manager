import React, { createContext, useState, useEffect, useCallback } from "react";
import { ipcRenderer } from "electron";
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
import SingletonGlobalStore from "../../GlobalStore/GlobalStore";
import { storeKeys } from "../../resources/StoreKeys/StoreKeys";
import { useFactoryContext } from "../utils/ReactUtils/ReactUtils";
import privacyPolicy from "../../resources/PrivacyPolicy/PrivacyPolicy";

const CheckboxLabel = ({ changed }) => (
  <span>
    {changed ? "We have updated our " : "I have read and I accept the "}
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
  changed: false,
};

export const PrivacyPolicyProvider = ({ children }) => {
  const [policy, setPolicy] = useState(initialState);
  const [loggedIn, setLoggedIn] = useState(() => {
    const globalStore = new SingletonGlobalStore();

    return globalStore.get(storeKeys.IS_LOGGED_IN, false);
  });
  const history = useHistory();

  const acceptedPrivacyPolicyChanged = useCallback(() => {
    const globalStore = new SingletonGlobalStore();

    const acceptedPrivacyPolicy = globalStore.get(
      storeKeys.ACCEPTED_PRIVACY_POLICY,
      null
    );

    if (!acceptedPrivacyPolicy || !acceptedPrivacyPolicy.version) {
      return true;
    }

    const acceptedPrivacyPolicyVersion = +acceptedPrivacyPolicy.version.split(
      "."
    )[0];
    const latestPrivacyPolicyVersion = +privacyPolicy.version.split(".")[0];

    return latestPrivacyPolicyVersion > acceptedPrivacyPolicyVersion;
  }, []);

  useEffect(() => {
    const globalStore = new SingletonGlobalStore();

    const unsubscribe = globalStore.onDidChange(
      storeKeys.IS_LOGGED_IN,
      isLoggedIn => {
        setLoggedIn(isLoggedIn);
      }
    );

    if (!loggedIn) {
      setPolicy(() => ({
        ...initialState,
        showDialog: true,
      }));
    }

    if (loggedIn && acceptedPrivacyPolicyChanged()) {
      setPolicy(() => ({
        ...initialState,
        changed: true,
        showDialog: true,
      }));
    } else {
      setPolicy(prevState => ({
        ...prevState,
        confirmed: true,
      }));
    }

    return () => unsubscribe();
  }, [acceptedPrivacyPolicyChanged, loggedIn]);

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
            label={<CheckboxLabel changed={policy.changed} />}
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
