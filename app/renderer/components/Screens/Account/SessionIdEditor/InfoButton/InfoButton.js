import React from "react";
import IconButton from "@mui/material/IconButton";
import HelpOutline from "@mui/icons-material/HelpOutline";
import * as electronUtils from "../../../../../utils/ElectronUtils/ElectronUtils";
import * as baseUrls from "../../../../../../shared/resources/BaseUrls/BaseUrls";
import { useInfoButtonStyles } from "./InfoButton.style";

export default () => {
  const classes = useInfoButtonStyles();

  return (
    <IconButton
      className={classes.iconButton}
      onClick={() => electronUtils.openExternalUrl(baseUrls.sessionIdWiki)}
      size="large"
    >
      <HelpOutline className={classes.helpIcon} />
    </IconButton>
  );
};
