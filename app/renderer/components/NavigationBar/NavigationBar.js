import React from "react";
import Paper from "@mui/material/Paper";
import NavigationItems from "./NavigationItems/NavigationItems";
import RightSide from "./RightSide/RightSide";
import RateLimitFeedback from "./RateLimitFeedback/RateLimitFeedback";
import { useNavigationBarStyles } from "./NavigationBar.style";

export default () => {
  return (
    <Paper sx={useNavigationBarStyles.container}>
      <RateLimitFeedback />
      <NavigationItems />
      <RightSide />
    </Paper>
  );
};
