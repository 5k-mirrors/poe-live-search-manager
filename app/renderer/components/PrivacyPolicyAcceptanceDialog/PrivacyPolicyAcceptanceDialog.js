import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { openExternalUrl } from "../../utils/ElectronUtils/ElectronUtils";
import { usePrivacyPolicy } from "../../contexts";
import { privacyPolicyActions } from "../../reducers/reducers";
import privacyPolicy from "../../../resources/PrivacyPolicy/PrivacyPolicy";

const CheckboxLabel = () => (
  <span>
    I have read and I accept the
    <Button onClick={() => openExternalUrl("PRIVACY_POLICY_LINK")}>
      Privacy Policy
    </Button>
  </span>
);

export default () => {
  const { policy, dispatch } = usePrivacyPolicy();

  return (
    <Dialog open={policy.showDialog}>
      <DialogTitle>Privacy Policy</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <FormControlLabel
            control={
              // eslint-disable-next-line react/jsx-wrap-multilines
              <Checkbox
                checked={policy.accepted}
                onChange={() =>
                  dispatch({ type: privacyPolicyActions.ACCEPTANCE_CHANGE })
                }
                value={policy.accepted}
              />
            }
            label={<CheckboxLabel />}
          />
        </DialogContentText>
        <DialogActions>
          <Button
            onClick={() =>
              dispatch({
                type: privacyPolicyActions.ACCEPTANCE_CONFIRMATION,
                payload: privacyPolicy,
              })
            }
            color="primary"
            variant="contained"
            disabled={!policy.accepted}
          >
            Agree
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
