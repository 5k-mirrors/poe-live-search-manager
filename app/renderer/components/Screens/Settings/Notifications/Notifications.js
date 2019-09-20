import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import TestNotification from "./TestNotification/TestNotification";
import Clipboard from "./Clipboard/Clipboard";

const notifications = () => (
  <Box>
    <Typography variant="h6">Notifications</Typography>
    <TestNotification />
    <Clipboard />
  </Box>
);

export default notifications;
