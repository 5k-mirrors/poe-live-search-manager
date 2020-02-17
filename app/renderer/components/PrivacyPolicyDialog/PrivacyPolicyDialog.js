import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { useFirebaseAuthObserver } from "../../utils/CustomHooks/CustomHooks";

export default () => {
  const [showDialog, setShowDialog] = useState(false);
  const [checked, setChecked] = useState(false);
  const { authenticated } = useFirebaseAuthObserver();

  useEffect(() => {
    if (!authenticated) {
      setShowDialog(true);
    }
  }, [authenticated]);

  return (
    <Dialog open={showDialog}>
      <DialogTitle>Privacy Policy</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <FormControlLabel
            control={
              // eslint-disable-next-line react/jsx-wrap-multilines
              <Checkbox
                checked={checked}
                onChange={() => setChecked(prevChecked => !prevChecked)}
                color="primary"
              />
            }
            label="I have read and I accept the Privacy Policy"
          />
        </DialogContentText>
        <DialogActions>
          <Button
            onClick={() => setShowDialog(false)}
            color="primary"
            variant="contained"
            disabled={!checked}
          >
            Agree
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
