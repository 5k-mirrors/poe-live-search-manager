import React from "react";
import Box from "@material-ui/core/Box";
import Typograpghy from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ReactTooltip from "react-tooltip";
import * as electronUtils from "../../../utils/ElectronUtils/ElectronUtils";
import * as baseUrls from "../../../../resources/BaseUrls/BaseUrls";
import * as regExes from "../../../../resources/RegExes/RegExes";
import { useRightSideStyles } from "./RightSide.style";
import { version } from "../../../../../package.json";

const displayRevisionTooltip = !regExes.semanticVersionNumberMatcher.test(
  process.env.REVISION
);

const rightSide = () => {
  const classes = useRightSideStyles();
  const versionNumber = `v${version}`;

  return (
    <Box display="flex" alignItems="center" className={classes.root}>
      <Typograpghy data-tip variant="subtitle2">
        {versionNumber}
      </Typograpghy>
      {displayRevisionTooltip ? (
        <ReactTooltip place="bottom" type="info">
          {process.env.REVISION}
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
