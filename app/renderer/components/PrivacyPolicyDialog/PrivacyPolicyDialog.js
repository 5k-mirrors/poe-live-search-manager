import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useFirebaseAuthObserver } from "../../utils/CustomHooks/CustomHooks";

export default () => {
  const [showDialog, setShowDialog] = useState(false);
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
        <DialogContentText>Text</DialogContentText>
        <DialogActions>
          <Button onClick={() => setShowDialog(false)} color="primary">
            Agree
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
};
