import React from "react";
import Box from "@material-ui/core/Box";
import Typograpghy from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import * as electronUtils from "../../../utils/ElectronUtils/ElectronUtils";
import * as baseUrls from "../../../../resources/BaseUrls/BaseUrls";
import { useRightSideStyles } from "./RightSide.style";

// https://stackoverflow.com/a/36733261/9599137
import { version } from "../../../../../package.json";

const isDev = process.env.NODE_ENV === "development";

const rightSide = () => {
  const classes = useRightSideStyles();
  const versionNumber = isDev ? `v${version}` : process.env.REVISION;

  return (
    <Box display="flex" alignItems="center" className={classes.root}>
      <Typograpghy variant="subtitle2">{versionNumber}</Typograpghy>
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
