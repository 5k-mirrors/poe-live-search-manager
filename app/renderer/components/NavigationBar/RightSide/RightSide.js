import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import * as electronUtils from "../../../utils/ElectronUtils/ElectronUtils";
import * as baseUrls from "../../../../resources/BaseUrls/BaseUrls";
import { useRightSideStyles } from "./RightSide.style";
import { version } from "../../../../../package.json";

const rightSide = () => {
  const classes = useRightSideStyles();
  const versionNumber = `v${version}`;
  const displayRevisionTooltip = versionNumber !== process.env.REVISION;

  return (
    <Box display="flex" alignItems="center">
      <Tooltip
        title={
          displayRevisionTooltip
            ? `Internal revision: ${process.env.REVISION}`
            : null
        }
      >
        <Typography variant="subtitle2">{versionNumber}</Typography>
      </Tooltip>
      <Button
        className={classes.button}
        onClick={() => electronUtils.openExternalUrl(baseUrls.reportIssue)}
      >
        Report issue
      </Button>
    </Box>
  );
};

export default rightSide;
