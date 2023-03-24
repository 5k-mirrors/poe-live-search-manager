import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import * as electronUtils from "../../../utils/ElectronUtils/ElectronUtils";
import * as baseUrls from "../../../../shared/resources/BaseUrls/BaseUrls";
import { useRightSideStyles } from "./RightSide.style";

export default () => {
  const classes = useRightSideStyles;

  return (
    <Box display="flex" alignItems="center">
      <Typography variant="subtitle2">{process.env.REVISION}</Typography>

      <Button
        sx={classes.button}
        onClick={() => electronUtils.openExternalUrl(baseUrls.reportIssue)}
      >
        Report issue
      </Button>
    </Box>
  );
};
