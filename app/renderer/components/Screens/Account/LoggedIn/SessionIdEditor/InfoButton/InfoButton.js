import React from "react";
import IconButton from "@material-ui/core/IconButton";
import HelpOutline from "@material-ui/icons/HelpOutline";
import * as electronUtils from "../../../../../../utils/ElectronUtils/ElectronUtils";
import * as baseUrls from "../../../../../../../resources/BaseUrls/BaseUrls";
import { useInfoButtonStyles } from "./InfoButton.style";

export default () => {
  const classes = useInfoButtonStyles();

  return (
    <IconButton
      className={classes.iconButton}
      onClick={() => electronUtils.openExternalUrl(baseUrls.sessionIdWiki)}
    >
      <HelpOutline className={classes.helpIcon} />
    </IconButton>
  );
};
