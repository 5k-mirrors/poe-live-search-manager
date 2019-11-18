import React from "react";
import Box from "@material-ui/core/Box";
import Typograpghy from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ReactTooltip from "react-tooltip";
import * as electronUtils from "../../../utils/ElectronUtils/ElectronUtils";
import * as baseUrls from "../../../../resources/BaseUrls/BaseUrls";
import { useRightSideStyles } from "./RightSide.style";
import { version } from "../../../../../package.json";
import tooltipIds from "../../../resources/TooltipIds/TooltipIds";

const rightSide = () => {
  const classes = useRightSideStyles();
  const versionNumber = `v${version}`;
  const displayRevisionTooltip = versionNumber !== process.env.REVISION;

  return (
    <Box display="flex" alignItems="center">
      <Typograpghy data-tip data-for={tooltipIds.REVISION} variant="subtitle2">
        {versionNumber}
      </Typograpghy>
      {displayRevisionTooltip ? (
        <ReactTooltip place="bottom" type="info">
          {`Internal revision: ${process.env.REVISION}`}
        </ReactTooltip>
      ) : null}
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
