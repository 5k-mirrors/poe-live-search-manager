import React from "react";
import Box from "@material-ui/core/Box";
import NotificationsInterval from "./NotificationsInterval/NotificationsInterval";
import TestNotification from "./TestNotification/TestNotification";
import Clipboard from "./Clipboard/Clipboard";
import ResultsListLimit from "./ResultsListLimit/ResultsListLimit";
import withRouteRestriction from "../../withRouteRestriction/withRouteRestriction";

const settings = () => (
  <Box>
    <NotificationsInterval />
    <TestNotification />
    <Clipboard />
    <ResultsListLimit />
  </Box>
);

export default withRouteRestriction(settings);
