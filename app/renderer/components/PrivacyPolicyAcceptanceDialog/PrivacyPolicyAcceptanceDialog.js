import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { openExternalUrl } from "../../utils/ElectronUtils/ElectronUtils";
import { useAuthContext } from "../../contexts";

const CheckboxLabel = () => (
  <span>
    I have read and I accept the
    <Button onClick={() => openExternalUrl("PRIVACY_POLICY_LINK")}>
      Privacy Policy
    </Button>
  </span>
);

export default () => {
  const [options, setOptions] = useState({
    showDialog: false,
    accepted: false,
  });
  const { state } = useAuthContext();

  useEffect(() => {
    if (!state.isLoggedIn) {
      setOptions(prevOptions => ({
        ...prevOptions,
        showDialog: true,
      }));
    } else {
      setOptions(prevOptions => ({
        ...prevOptions,
        showDialog: false,
      }));
    }
  }, [state.isLoggedIn]);

  return (
    <Dialog open={options.showDialog}>
      <DialogTitle>Privacy Policy</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <FormControlLabel
            control={
              // eslint-disable-next-line react/jsx-wrap-multilines
              <Checkbox
                checked={options.accepted}
                onChange={() =>
                  setOptions(prevOptions => ({
                    ...prevOptions,
                    accepted: !prevOptions.accepted,
                  }))
                }
                value={options.accepted}
              />
            }
            label={<CheckboxLabel />}
          />
        </DialogContentText>
        <DialogActions>
          <Button
            color="primary"
            variant="contained"
            disabled={!options.accepted}
            onClick={() =>
              setOptions(prevOptions => ({ ...prevOptions, showDialog: false }))
            }
          >
            Agree
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
