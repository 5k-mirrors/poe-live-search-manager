import React from "react";
import Box from "@material-ui/core/Box";
import Typograpghy from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import * as electronUtils from "../../../utils/ElectronUtils/ElectronUtils";
import * as baseUrls from "../../../../resources/BaseUrls/BaseUrls";
import { useRightSideStyles } from "./RightSide.style";

const rightSide = () => {
  const classes = useRightSideStyles();

  return (
    <Box display="flex" alignItems="center" className={classes.root}>
      <Typograpghy variant="subtitle2">{process.env.REVISION}</Typograpghy>
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
