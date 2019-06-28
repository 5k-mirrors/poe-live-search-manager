import React from "react";
import { shell } from "electron";
import IconButton from "@material-ui/core/IconButton";
import HelpOutline from "@material-ui/icons/HelpOutline";
import { useInfoButtonStyles } from "./InfoButton.style";

const infoButton = () => {
  const classes = useInfoButtonStyles();

  function onInfoButtonClick() {
    shell.openExternal(
      "https://github.com/Stickymaddness/Procurement/wiki/SessionID"
    );
  }

  return (
    <IconButton className={classes.iconButton} onClick={onInfoButtonClick}>
      <HelpOutline className={classes.helpIcon} />
    </IconButton>
  );
};

export default infoButton;
