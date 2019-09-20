import React from "react";
import Box from "@material-ui/core/Box";
import Display from "./Display/Display";
import Notifications from "./Notifications/Notifications";
import withRouteRestriction from "../../withRouteRestriction/withRouteRestriction";

const settings = () => (
  <Box>
    <Notifications />
    <Display />
  </Box>
);

export default withRouteRestriction(settings);
