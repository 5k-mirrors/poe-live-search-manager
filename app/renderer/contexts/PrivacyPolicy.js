import React, { createContext, useState, useEffect, useRef } from "react";
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
  const [state, setState] = useState(initialState);
  const isLoggedInRef = useRef();
  const history = useHistory();

  const acceptedPrivacyPolicyChanged = () => {
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
  };

  useEffect(() => {
    const globalStore = new SingletonGlobalStore();

    isLoggedInRef.current = globalStore.get(storeKeys.IS_LOGGED_IN, false);

    if (!isLoggedInRef.current) {
      setState(prevState => ({
        ...prevState,
        ...initialState,
        showDialog: true,
      }));
    }

    if (isLoggedInRef.current && acceptedPrivacyPolicyChanged()) {
      setState(prevState => ({
        ...prevState,
        changed: true,
        showDialog: true,
      }));
    }

    if (isLoggedInRef.current && !acceptedPrivacyPolicyChanged()) {
      setState(prevState => ({
        ...prevState,
        confirmed: true,
      }));
    }
  }, []);

  const handlePrivacyPolicyConfirmation = () => {
    ipcRenderer.send(ipcEvents.ACCEPTED_PRIVACY_POLICY_UPDATED, privacyPolicy);

    history.push("/account");

    setState(prevState => ({
      ...prevState,
      confirmed: true,
      showDialog: false,
    }));
  };

  const handleCheckboxChange = () => {
    setState(prevState => ({
      ...prevState,
      checked: !prevState.checked,
    }));
  };

  const showPrivacyPolicyAcceptanceDialog = () => {
    isLoggedInRef.current = false;

    setState(prevState => ({
      ...prevState,
      ...initialState,
      showDialog: true,
    }));
  };

  const renderDialog = () => (
    <Dialog open={state.showDialog}>
      <DialogTitle>Privacy Policy</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <FormControlLabel
            control={
              // eslint-disable-next-line react/jsx-wrap-multilines
              <Checkbox
                checked={state.checked}
                onChange={handleCheckboxChange}
                value={state.checked}
              />
            }
            label={<CheckboxLabel changed={state.changed} />}
          />
        </DialogContentText>
        <DialogActions>
          <Button
            color="primary"
            variant="contained"
            disabled={!state.checked}
            onClick={handlePrivacyPolicyConfirmation}
          >
            Agree
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );

  if (isLoggedInRef.current && !state.confirmed) {
    return (
      <PrivacyPolicyContext.Provider>
        {renderDialog()}
      </PrivacyPolicyContext.Provider>
    );
  }

  return (
    <PrivacyPolicyContext.Provider
      value={{ showPrivacyPolicyAcceptanceDialog }}
    >
      {children}
      {renderDialog()}
    </PrivacyPolicyContext.Provider>
  );
};

export const usePrivacyPolicyContext = () =>
  useFactoryContext(PrivacyPolicyContext);
