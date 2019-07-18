import React from "react";
import Box from "@material-ui/core/Box";
import withLoggedOutRestriction from "../../withLoggedOutRedirection/withLoggedOutRedirection";
import NotificationsInterval from "./NotificationsInterval/NotificationsInterval";
import TestNotification from "./TestNotification/TestNotification";
import Clipboard from "./Clipboard/Clipboard";

const settings = () => (
  <Box>
    <NotificationsInterval />
    <TestNotification />
    <Clipboard />
  </Box>
);

export default withLoggedOutRestriction(settings, "/account");
