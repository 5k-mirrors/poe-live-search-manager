import React from "react";
import Box from "@material-ui/core/Box";
import Display from "./Display/Display";
import Notifications from "./Notifications/Notifications";

export default () => (
  <Box>
    <Notifications />
    <Display />
  </Box>
);
