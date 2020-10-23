import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import * as electronUtils from "../../../utils/ElectronUtils/ElectronUtils";
import * as baseUrls from "../../../../shared/resources/BaseUrls/BaseUrls";
import { useRightSideStyles } from "./RightSide.style";
import packageJson from "../../../../../package.json";

export default () => {
  const classes = useRightSideStyles();
  const versionNumber = `v${packageJson.version}`;
  const displayRevisionTooltip = versionNumber !== process.env.REVISION;

  return (
    <Box display="flex" alignItems="center">
      {displayRevisionTooltip ? (
        <Tooltip title={`Internal revision: ${process.env.REVISION}`}>
          <Typography variant="subtitle2">{versionNumber}</Typography>
        </Tooltip>
      ) : (
        <Typography variant="subtitle2">{versionNumber}</Typography>
      )}

      <Button
        className={classes.button}
        onClick={() => electronUtils.openExternalUrl(baseUrls.reportIssue)}
      >
        Report issue
      </Button>
    </Box>
  );
};
