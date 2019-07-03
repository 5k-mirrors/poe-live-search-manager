import React from "react";
import Typograpghy from "@material-ui/core/Typography";
import { useVersionDisplayerStyles } from "./VersionDisplayer.style";

// https://stackoverflow.com/a/36733261/9599137
import { version } from "../../../../../package.json";

const versionDisplayer = () => {
  const classes = useVersionDisplayerStyles();
  const versionNumber = `v${version}`;

  return (
    <Typograpghy className={classes.root} variant="subtitle2">
      {versionNumber}
    </Typograpghy>
  );
};

export default versionDisplayer;
